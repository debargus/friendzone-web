import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { HiFire, HiOutlineBookmark, HiOutlineLockClosed, HiOutlinePencilAlt, HiOutlineShare } from 'react-icons/hi'
import sanitizeHtml from 'sanitize-html'
import SEO from '../../../components/shared/SEO'
import usePost, { fetchPost } from '../../../lib/client/hooks/post/usePost'
import useMyInfo from '../../../lib/client/hooks/user/useMyInfo'
import { PostResponse } from '../../../types/response'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import PostEngagement from '../../../components/PostEngagement'
import { EditorState, convertToRaw } from 'draft-js'
import dynamic from 'next/dynamic'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import useCommentPost, { PostCommentPayload } from '../../../lib/client/hooks/post/useCommentPost'
import { useQueryClient } from 'react-query'
import useAddHot from '../../../lib/client/hooks/post/useAddHot'
import Layout from '../../../components/shared/Layout'

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
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: postData } = usePost(post.id, post)
    const { data: myInfo } = useMyInfo(authenticated)
    const { mutateAsync: postComment } = useCommentPost()
    const { mutateAsync: addHot, isLoading: isAddingHot } = useAddHot()
    // const { mutate: removeHot, isLoading: isRemovingHot } = useRemoveHot()

    if (!postData) {
        return <p>Loading...</p>
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
            await postComment(payload)
            toast.success('Comment posted!')
            setEditorState(EditorState.createEmpty())
            queryClient.invalidateQueries(['post_details', postData?.id])
        } catch (err) {
            console.log(err)
            toast.error('Something went wrong!')
        }
    }

    async function handleHotClick() {
        try {
            await addHot(id)
            toast.success('Post marked as Hot')
        } catch (err) {
            toast.error('Post could not be marked as Hot')
        }
    }

    const { id, author, content, created_at, group, is_public, comments, hots_count, is_updated } = postData

    return (
        <SEO title={`Posted by ${author.name}`}>
            <Layout>
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
                                {formatDistanceToNow(new Date(created_at), { addSuffix: true })}{' '}
                                {is_updated && '(edited)'}
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
                            <button className="button-icon h-8" onClick={handleHotClick} disabled={isAddingHot}>
                                <HiFire fontSize={20} className="text-slate-500 -ml-1" />
                                <span className="ml-1 text-sm font-medium">{hots_count}</span>
                            </button>
                            <button className="button-icon h-8">
                                <HiOutlineBookmark fontSize={20} className="text-slate-500" />
                            </button>
                            <button className="button-icon h-8">
                                <HiOutlineShare fontSize={20} className="text-slate-500" />
                            </button>
                            {myInfo?.id === post.author.id ? (
                                <button
                                    className="button-icon h-8"
                                    onClick={() => router.push(`/post/${post.id}/edit`)}
                                >
                                    <HiOutlinePencilAlt fontSize={20} />
                                </button>
                            ) : null}
                        </div>
                        <h3 className="font-semibold text-sm text-slate-700 mt-6">{comments.length} Comments</h3>
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
                                    }input h-auto text-sm min-h-[4rem] py-2`}
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
                        <div className="mt-6">
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
            </Layout>
        </SEO>
    )
}

export default PostDetails
