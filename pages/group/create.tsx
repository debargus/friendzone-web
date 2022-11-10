import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineCamera, HiOutlinePhotograph } from 'react-icons/hi'
import ReactCrop, { Crop } from 'react-image-crop'
import { useQueryClient } from 'react-query'
import SEO from '../../components/shared/SEO'
import usePresignedUrl from '../../lib/client/hooks/asset/usePresignedUrl'
import useUploadImage from '../../lib/client/hooks/asset/useUploadImage'
import useCreateGroup from '../../lib/client/hooks/group/useCreateGroup'
import { getCroppedImg } from '../../lib/utils/getCroppedImg'
import { GroupCreatePayload } from '../../types/response'
import { EditorState, convertToRaw } from 'draft-js'
import dynamic from 'next/dynamic'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import Layout from '../../components/shared/Layout'
import PopularGroups from '../../components/PopularGroups'
import { GetServerSideProps } from 'next'
import { detectMobile } from '../../lib/utils/detectDevice'

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(({ Editor }) => Editor) as any, {
    ssr: false
}) as typeof Editor

const cropDimensions: Crop = { x: 0, y: 0, width: 300, height: 100, unit: 'px' }

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context
    const isMobile = detectMobile(req)

    return {
        props: { isMobile }
    }
}

interface CreateGroupProps {
    isMobile: boolean
}

function CreateGroup({ isMobile }: CreateGroupProps) {
    const [groupName, setGroupName] = useState('')
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const [cropModalData, setCropModalData] = useState<{ file: File; type: 'DISPLAY' | 'COVER' } | null>(null)
    const [crop, setCrop] = useState<Crop>(cropDimensions)
    const [imageSrc, setImageSrc] = useState<string>()
    const imgRef = useRef<HTMLImageElement>(null)

    const [croppedCoverImg, setCroppedCoverImg] = useState<string>()
    const [croppedDisplayImg, setCroppedDisplayImg] = useState<string>()
    const [croppedCoverBlob, setCroppedCoverBlob] = useState<Blob>()
    const [croppedDisplayBlob, setCroppedDisplayBlob] = useState<Blob>()

    const router = useRouter()
    const queryClient = useQueryClient()

    const getPresignedUrl = usePresignedUrl()
    const uploadImage = useUploadImage()
    const { mutateAsync: createGroup, isLoading: isCreatingGroup, reset: resetCreateGroup } = useCreateGroup()

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

    async function handleCreateGroup() {
        if (!croppedCoverBlob || !croppedDisplayBlob) return

        const coverImagePresignedUrl = await getPresignedUrl()
        const displayImagePresignedUrl = await getPresignedUrl()

        const response = await Promise.all([
            uploadImage(coverImagePresignedUrl, croppedCoverBlob),
            uploadImage(displayImagePresignedUrl, croppedDisplayBlob)
        ])

        const editorContent = editorState.getCurrentContent()
        const isEditorEmpty = !editorContent.hasText()

        if (isEditorEmpty) return

        const payload: GroupCreatePayload = {
            name: groupName,
            description: draftToHtml(convertToRaw(editorContent)),
            cover_image: response[0],
            display_image: response[1]
        }

        try {
            const groupResponse = await createGroup(payload)
            const groupId = groupResponse?.id
            toast.success('Group created successfully!')
            setTimeout(() => {
                router.push(`/group/${groupId}`)
                queryClient.invalidateQueries('popular_groups')
            }, 400)
        } catch {
            toast.success('Something went wrong. Try again!')
        }
    }

    useEffect(() => {
        return () => {
            resetCreateGroup()
        }
    }, [])

    return (
        <SEO title="Create a new group">
            <Layout aside={<PopularGroups />} isMobile={isMobile}>
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-700 mb-5">Create Group</h3>
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
                        {croppedCoverImg && (
                            <img src={croppedCoverImg} className="absolute w-full h-full object-cover" />
                        )}
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
                        {croppedDisplayImg && (
                            <img src={croppedDisplayImg} className="absolute w-full h-full object-cover" />
                        )}
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
                    <div className="flex items-center mt-6">
                        <button type="button" className="button" onClick={handleCreateGroup} disabled={isCreatingGroup}>
                            Create Group
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
            </Layout>
        </SEO>
    )
}

export default CreateGroup
