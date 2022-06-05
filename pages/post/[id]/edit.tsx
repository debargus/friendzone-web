import { Dialog, Listbox, Switch, Transition } from '@headlessui/react'
import classNames from 'classnames'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiCheck, HiOutlineSelector } from 'react-icons/hi'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import dynamic from 'next/dynamic'
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import { useRouter } from 'next/router'
import useMyInfo from '../../../lib/client/hooks/user/useMyInfo'
import useUserGroups from '../../../lib/client/hooks/user/useUserGroups'
import SEO from '../../../components/shared/SEO'
import Layout from '../../../components/shared/Layout'
import useDeletePost from '../../../lib/client/hooks/post/useDeletePost'
import { PostResponse } from '../../../types/response'
import { GetServerSideProps } from 'next'
import { fetchPost } from '../../../lib/client/hooks/post/usePost'
import useUpdatePost, { PostUpdatePayload } from '../../../lib/client/hooks/post/useUpdatePost'
import PopularGroups from '../../../components/PopularGroups'

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(({ Editor }) => Editor) as any, {
    ssr: false
}) as typeof Editor

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params, req } = context
    const authenticated = !!req.cookies?.jwt

    const post = await fetchPost(String(params?.id))

    if (!post) {
        return {
            notFound: true
        }
    }

    if (!authenticated) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: { post }
    }
}

interface UpdatePostProps {
    post: PostResponse
}

function UpdatePost({ post }: UpdatePostProps) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
    const [isPublic, setIsPublic] = useState(true)
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const router = useRouter()

    const { data: myInfo } = useMyInfo(true)
    const { data: myGroups } = useUserGroups(myInfo?.id)
    const { mutateAsync: updatePost, isLoading: isUpdatingPost } = useUpdatePost()
    const { mutateAsync: deletePost, isLoading: isDeletingPost } = useDeletePost()

    const grabGroupNameById = useCallback(
        (id: string) => {
            const groupFiltered = myGroups?.groups?.filter((group) => group.id === id)
            if (groupFiltered?.length) {
                return groupFiltered[0].name
            } else {
                return ''
            }
        },
        [myGroups]
    )

    async function handleUpdatePost() {
        const editorContent = editorState.getCurrentContent()
        const isEditorEmpty = !editorContent.hasText()

        if (isEditorEmpty) {
            toast.error('Please type something')
            return
        }

        const payload: PostUpdatePayload = {
            post_id: post.id,
            content: draftToHtml(convertToRaw(editorContent)),
            is_public: isPublic
        }

        try {
            await updatePost(payload)
            toast.success('Post updated successfully!')
            setTimeout(() => {
                router.push(`/post/${post.id}`)
            }, 200)
        } catch (err) {
            console.log(err)
            toast.error('Something went wrong! Try again')
        }
    }

    async function handleDeletePost() {
        if (myInfo?.id !== post.author.id) return
        await deletePost(post.id)
        toast.success('Post deleted successfully!')
        router.push('/')
    }

    useEffect(() => {
        const { content, is_public } = post
        setIsPublic(is_public)
        if (content) {
            const contentBlock = htmlToDraft(content)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                setEditorState(EditorState.createWithContent(contentState))
            }
        }
    }, [post])

    useEffect(() => {
        if (!post.group.id || !myGroups?.groups.length) return
        const selectedGroup = !!myGroups.groups.find((group) => group.id === post.group.id)
        if (selectedGroup) setSelectedGroupId(post.group.id)
    }, [myGroups, post])

    return (
        <SEO title="Update post">
            <Layout aside={<PopularGroups />}>
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-700 mb-5">Update post</h3>
                    <div className="mt-4">
                        <div className="min-h-[7rem]">
                            <RichEditor
                                stripPastedStyles
                                toolbarHidden
                                onFocus={() => setIsEditorFocused(true)}
                                onBlur={() => setIsEditorFocused(false)}
                                editorClassName={`${
                                    isEditorFocused ? 'border-transparent ring-2 ring-sky-500 ' : ''
                                }input h-auto text-sm min-h-[7rem] py-2`}
                                editorState={editorState}
                                onEditorStateChange={(state) => setEditorState(state)}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-start justify-between">
                        <Listbox value={selectedGroupId} onChange={() => null}>
                            <div className="relative w-48 pointer-events-none opacity-50">
                                <Listbox.Button className="relative w-full cursor-default border border-slate-100 rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
                                    <span className={classNames(!selectedGroupId && 'opacity-50', 'block truncate')}>
                                        {selectedGroupId ? grabGroupNameById(selectedGroupId) : 'Select a group'}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <HiOutlineSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute m-0 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                        {myGroups &&
                                            myGroups.groups?.map((group, groupIdx) => (
                                                <Listbox.Option
                                                    key={groupIdx}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 m-0 ${
                                                            active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={group.id}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${
                                                                    selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                            >
                                                                {group.name}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                                                                    <HiCheck className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                        <div className="flex items-center">
                            <Switch.Group>
                                <Switch
                                    checked={isPublic}
                                    onChange={setIsPublic}
                                    className={`${
                                        isPublic ? 'bg-sky-500' : 'bg-slate-300'
                                    } relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                    <span className="sr-only">Public Post</span>
                                    <span
                                        aria-hidden="true"
                                        className={`${
                                            isPublic ? 'translate-x-4' : 'translate-x-0'
                                        } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                </Switch>
                                <Switch.Label className="ml-2 cursor-pointer text-sm text-slate-600">
                                    Publicly visible
                                </Switch.Label>
                            </Switch.Group>
                        </div>
                    </div>
                    <div className="flex items-center mt-6 gap-2">
                        <button type="button" className="button" onClick={handleUpdatePost} disabled={isUpdatingPost}>
                            Update Post
                        </button>
                        <button
                            type="button"
                            className="button-light text-red-500"
                            onClick={() => setDeleteModalOpen(true)}
                        >
                            Delete Post
                        </button>
                    </div>
                </div>
            </Layout>
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
                                    <div className="mt-4">Are you really sure to delete this post?</div>
                                    <div className="mt-4 flex items-center justify-end">
                                        <button
                                            type="button"
                                            className="button bg-red-500 active:bg-red-600"
                                            disabled={isDeletingPost}
                                            onClick={handleDeletePost}
                                        >
                                            Delete Post
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
        </SEO>
    )
}

export default UpdatePost
