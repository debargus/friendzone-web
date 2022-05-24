import { Fragment, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { HiOutlineBookmark, HiOutlineLockClosed, HiOutlineShare, HiOutlineTrash } from 'react-icons/hi'
import sanitizeHtml from 'sanitize-html'
import SEO from '../../components/shared/SEO'
import usePost, { fetchPost } from '../../lib/client/hooks/post/usePost'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'
import { PostResponse } from '../../types/response'
import { Dialog, Transition } from '@headlessui/react'
import useDeletePost from '../../lib/client/hooks/post/useDeletePost'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import PostEngagement from '../../components/PostEngagement'
import { EditorState, convertToRaw } from 'draft-js'
import dynamic from 'next/dynamic'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import useCommentPost, { PostCommentPayload } from '../../lib/client/hooks/post/useCommentPost'
import { useQueryClient } from 'react-query'

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

    return {
        props: { post, authenticated }
    }
}

interface PostDetailsProps {
    post: PostResponse
    authenticated: boolean
}

function PostDetails({ post, authenticated }: PostDetailsProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: postData } = usePost(post.id, post)
    const { data: myInfo } = useMyInfo(authenticated)
    const { mutateAsync: deletePost, isLoading: isDeletingPost } = useDeletePost()
    const { mutateAsync: postComment } = useCommentPost()

    if (!postData) {
        return <p>Loading...</p>
    }

    async function handleDeletePost() {
        if (myInfo?.id !== post.author.id) return
        await deletePost(id)
        toast.success('Post deleted successfully!')
        router.push('/')
    }

    async function handleCommentPost() {
        const editorContent = editorState.getCurrentContent()
        const isEditorEmpty = !editorContent.hasText()

        if (isEditorEmpty) {
            toast.error('Please type something')
            return
        }

        const payload: PostCommentPayload = {
            comment_text: draftToHtml(convertToRaw(editorContent)),
            post_id: postData?.id!
        }

        try {
            const response = await postComment(payload)
            console.log('response', response)
            toast.success('Comment posted!')
            setEditorState(EditorState.createEmpty())
            queryClient.invalidateQueries(['post_details', postData?.id])
        } catch (err) {
            console.log(err)
            toast.error('Something went wrong!')
        }
    }

    const { id, author, content, created_at, group, is_public, comments } = postData

    return (
        <SEO title={`Posted by ${author.name}`}>
            <div className="flex flex-row items-start w-full mb-8">
                <div className="flex flex-col items-center min-w-fit">
                    <Link href={`/user/${author.username}`}>
                        <a>
                            <div
                                className="h-10 w-10 bg-cover bg-center bg-sky-200 rounded-full"
                                style={{ backgroundImage: `url("${author.avatar}")` }}
                            />
                        </a>
                    </Link>
                    <PostEngagement post={postData} />
                </div>
                <div className="flex flex-col ml-3 flex-1">
                    <div className="flex flex-row items-center text-sm mb-1.5 gap-2">
                        <Link href={`/user/${author.username}`}>
                            <a>
                                <strong>{author.name}</strong>
                                <span className="text-slate-400 font-medium ml-2">@{author.username}</span>
                            </a>
                        </Link>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-slate-500">
                            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
                        </span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
                    <div className="text-sm text-slate-400">
                        Posted in{' '}
                        <Link href={`/group/${group.id}`}>
                            <a className="link mr-3">{group.name}</a>
                        </Link>
                        {!is_public && (
                            <div
                                title="Visible to only group members"
                                className="cursor-default text-xs text-white bg-slate-400 rounded-md px-1.5 py-0.5 inline-flex items-center"
                            >
                                <HiOutlineLockClosed fontSize={12} />
                                <span className="pl-1">Only group</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                        <button className="button-icon h-8">
                            <HiOutlineBookmark fontSize={20} />
                        </button>
                        <button className="button-icon h-8">
                            <HiOutlineShare fontSize={20} />
                        </button>
                        {myInfo?.id === post.author.id ? (
                            <button className="button-icon h-8" onClick={() => setDeleteModalOpen(true)}>
                                <HiOutlineTrash fontSize={20} />
                            </button>
                        ) : null}
                    </div>
                    <h3 className="font-semibold text-sm text-slate-700 mt-4">{comments.length} Comments</h3>
                    <div className="flex items-start gap-4 mt-3">
                        {myInfo?.username ? (
                            <Link href={`/user/${myInfo.username}`}>
                                <a>
                                    <div
                                        className="h-8 w-8 min-w-[2rem] bg-sky-400 bg-cover bg-center rounded-full"
                                        style={{ backgroundImage: `url("${myInfo?.avatar}")` }}
                                    />
                                </a>
                            </Link>
                        ) : (
                            <div className="h-8 w-8 min-w-[2rem] bg-sky-400 rounded-full" />
                        )}
                        <div className="w-full min-h-[4rem]">
                            <RichEditor
                                stripPastedStyles
                                toolbarHidden
                                onFocus={() => setIsEditorFocused(true)}
                                onBlur={() => setIsEditorFocused(false)}
                                editorClassName={`${
                                    isEditorFocused ? 'border-transparent ring-2 ring-sky-500 ' : ''
                                }input h-auto text-base min-h-[4rem] py-2`}
                                editorState={editorState}
                                onEditorStateChange={(state) => setEditorState(state)}
                            />
                        </div>
                        <div>
                            <button className="button" onClick={handleCommentPost}>
                                Comment
                            </button>
                        </div>
                    </div>
                    <div className="mt-8">
                        {comments.map((comment) => (
                            <div className="flex items-start mb-4" key={comment.id}>
                                <Link href={`/user/${comment.author.username}`}>
                                    <a>
                                        <div
                                            className="h-8 w-8 min-w-[2rem] bg-sky-400 bg-cover bg-center rounded-full"
                                            style={{ backgroundImage: `url("${comment.author.avatar}")` }}
                                        />
                                    </a>
                                </Link>
                                <div className="ml-3">
                                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.comment_text) }} />
                                    <span className="text-slate-400 text-sm block">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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

export default PostDetails
