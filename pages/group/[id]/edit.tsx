import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineCamera, HiOutlinePhotograph } from 'react-icons/hi'
import ReactCrop, { Crop } from 'react-image-crop'
import { useQueryClient } from 'react-query'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import dynamic from 'next/dynamic'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { GetServerSideProps } from 'next'
import { GroupResponse, GroupUpdatePayload } from '../../../types/response'
import { client } from '../../../lib/client'
import usePresignedUrl from '../../../lib/client/hooks/asset/usePresignedUrl'
import useUploadImage from '../../../lib/client/hooks/asset/useUploadImage'
import SEO from '../../../components/shared/SEO'
import Layout from '../../../components/shared/Layout'
import { getCroppedImg } from '../../../lib/utils/getCroppedImg'
import useUpdateGroup from '../../../lib/client/hooks/group/useUpdateGroup'
import useDeleteGroup from '../../../lib/client/hooks/group/useDeleteGroup'

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(({ Editor }) => Editor) as any, {
    ssr: false
}) as typeof Editor

const cropDimensions: Crop = { x: 0, y: 0, width: 300, height: 100, unit: 'px' }

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params, req } = context
    const authenticated = !!req.cookies?.jwt

    const response = await client.get('/group/' + params?.id)

    if (!response.data) {
        return {
            notFound: true
        }
    }

    return {
        props: { group: response.data?.data.group, authenticated }
    }
}

interface GroupUpdateProps {
    group: GroupResponse
    authenticated: boolean
}

function UpdateGroup({ group }: GroupUpdateProps) {
    const [groupName, setGroupName] = useState('')
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const [cropModalData, setCropModalData] = useState<{ file: File; type: 'DISPLAY' | 'COVER' } | null>(null)
    const [crop, setCrop] = useState<Crop>(cropDimensions)
    const [imageSrc, setImageSrc] = useState<string>()
    const imgRef = useRef<HTMLImageElement>(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const [croppedCoverImg, setCroppedCoverImg] = useState<string>()
    const [croppedDisplayImg, setCroppedDisplayImg] = useState<string>()
    const [croppedCoverBlob, setCroppedCoverBlob] = useState<Blob>()
    const [croppedDisplayBlob, setCroppedDisplayBlob] = useState<Blob>()

    const router = useRouter()
    const queryClient = useQueryClient()

    const getPresignedUrl = usePresignedUrl()
    const uploadImage = useUploadImage()
    const { mutateAsync: updateGroup, reset: resetUpdateGroup, isLoading: isUpdatingGroup } = useUpdateGroup()
    const { mutateAsync: deleteGroup, isLoading: isDeletingGroup } = useDeleteGroup()

    async function handleSelectImage(e: any, type: 'DISPLAY' | 'COVER'): Promise<void> {
        const selectedFile = e.target.files[0]
        const fileType = selectedFile.type.substr(0, 5)

        if (fileType !== 'image') toast.error('Please select a valid image file')

        setImageSrc(URL.createObjectURL(selectedFile))
        setCropModalData({ file: selectedFile, type })
    }

    async function handleImageCrop() {
        if (!imgRef.current) return
        const { base64Image, imgBlob } = await getCroppedImg(imgRef.current, crop)

        if (cropModalData?.type === 'COVER') {
            setCroppedCoverImg(base64Image)
            setCroppedCoverBlob(imgBlob)
        } else {
            setCroppedDisplayImg(base64Image)
            setCroppedDisplayBlob(imgBlob)
        }

        setCropModalData(null)
    }

    async function handleUpdateGroup() {
        let updatePayload: GroupUpdatePayload = { id: group.id, name: groupName }

        if (croppedCoverBlob) {
            const coverImagePresignedUrl = await getPresignedUrl()
            const coverUrl = await uploadImage(coverImagePresignedUrl, croppedCoverBlob)
            updatePayload.cover_image = coverUrl
        }

        if (croppedDisplayBlob) {
            const displayImagePresignedUrl = await getPresignedUrl()
            const displayUrl = await uploadImage(displayImagePresignedUrl, croppedDisplayBlob)
            updatePayload.display_image = displayUrl
        }

        const editorContent = editorState.getCurrentContent()
        const isEditorEmpty = !editorContent.hasText()

        if (!isEditorEmpty) {
            updatePayload.description = draftToHtml(convertToRaw(editorContent))
        }

        try {
            await updateGroup(updatePayload)
            toast.success('Group updated successfully!')
            setTimeout(() => {
                router.push(`/group/${group.id}`)
                queryClient.invalidateQueries('popular_groups')
            }, 400)
        } catch {
            toast.success('Something went wrong. Try again!')
        }
    }

    async function handleDeleteGroup() {
        await deleteGroup(group.id)
        toast.success('Group deleted successfully!')
        setDeleteModalOpen(false)
        setTimeout(() => {
            router.push('/')
            queryClient.invalidateQueries('popular_groups')
        }, 400)
    }

    useEffect(() => {
        const { name, description } = group
        setGroupName(name)
        if (description) {
            const contentBlock = htmlToDraft(description)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                setEditorState(EditorState.createWithContent(contentState))
            }
        }
        return () => {
            resetUpdateGroup()
        }
    }, [group])

    return (
        <SEO title="Create a new group">
            <Layout>
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-700 mb-5">Update Group</h3>
                    <label
                        htmlFor="group_cover_image"
                        className="relative aspect-[6/2] rounded-lg bg-cover bg-center bg-sky-100 flex cursor-pointer overflow-hidden"
                    >
                        <div className="flex items-center gap-2 m-auto text-sky-600">
                            <HiOutlinePhotograph fontSize={24} />
                            <span className="text-base">Upload cover image</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            id="group_cover_image"
                            className="sr-only"
                            onChange={(e) => handleSelectImage(e, 'COVER')}
                        />
                        <img
                            src={croppedCoverImg || group.cover_image}
                            className="absolute w-full h-full object-cover"
                        />
                    </label>
                    <label
                        htmlFor="group_display_image"
                        className="relative aspect-square flex w-20 bg-cover bg-center bg-sky-200 rounded-lg -mt-12 ml-8 border border-2 border-white cursor-pointer overflow-hidden"
                    >
                        <HiOutlineCamera fontSize={24} className="m-auto text-sky-600" />
                        <input
                            type="file"
                            accept="image/*"
                            id="group_display_image"
                            className="sr-only"
                            onChange={(e) => handleSelectImage(e, 'DISPLAY')}
                        />
                        <img
                            src={croppedDisplayImg || group.display_image}
                            className="absolute w-full h-full object-cover"
                        />
                    </label>
                    <div className="mt-4 max-w-md">
                        <label htmlFor="group_name" className="block text-sm font-medium text-slate-700">
                            Group Name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="group_name"
                                className="input"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="mt-4 w-full">
                        <label htmlFor="group_description" className="block text-sm font-medium text-slate-700">
                            Group Description
                        </label>
                        <div className="mt-2 min-h-[4rem]">
                            <RichEditor
                                stripPastedStyles
                                toolbarHidden
                                onFocus={() => setIsEditorFocused(true)}
                                onBlur={() => setIsEditorFocused(false)}
                                editorClassName={`${
                                    isEditorFocused ? 'border-transparent ring-2 ring-sky-500 ' : ''
                                }input h-auto text-sm min-h-[4rem] py-2`}
                                editorState={editorState}
                                onEditorStateChange={(state) => setEditorState(state)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center mt-6 gap-2">
                        <button type="button" className="button" onClick={handleUpdateGroup} disabled={isUpdatingGroup}>
                            Update Group
                        </button>
                        <button
                            type="button"
                            className="button-light text-red-500"
                            onClick={() => setDeleteModalOpen(true)}
                        >
                            Delete Group
                        </button>
                    </div>
                </div>
                {cropModalData ? (
                    <Transition appear show={true} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={() => setCropModalData(null)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-25" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-200"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="w-full max-w-xl transform rounded-lg bg-white p-5 text-left align-middle shadow-xl transition-all">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                Crop Image
                                            </Dialog.Title>
                                            <div className="mt-4">
                                                <ReactCrop
                                                    crop={crop}
                                                    aspect={cropModalData.type === 'COVER' ? 6 / 2 : 1 / 1}
                                                    onChange={(c) => setCrop(c)}
                                                >
                                                    <img src={imageSrc} alt="cropped image" ref={imgRef} />
                                                </ReactCrop>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <button type="button" className="button" onClick={handleImageCrop}>
                                                    Crop
                                                </button>
                                                <button
                                                    type="button"
                                                    className="button-light ml-2"
                                                    onClick={() => setCropModalData(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                ) : null}
                <Transition appear show={deleteModalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={setDeleteModalOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-200"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-5 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                            Confirmation
                                        </Dialog.Title>
                                        <div className="mt-4">Are you really sure to delete this group?</div>
                                        <div className="mt-4 flex items-center justify-end">
                                            <button
                                                type="button"
                                                className="button bg-red-500 active:bg-red-600"
                                                disabled={isDeletingGroup}
                                                onClick={handleDeleteGroup}
                                            >
                                                Delete Group
                                            </button>
                                            <button
                                                type="button"
                                                className="button-light ml-2"
                                                onClick={() => setDeleteModalOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </Layout>
        </SEO>
    )
}

export default UpdateGroup
