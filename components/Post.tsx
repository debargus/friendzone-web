import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { HiFire, HiOutlineBookmark, HiOutlineChat, HiOutlineLockClosed, HiOutlineShare } from 'react-icons/hi'
import { ImArrowDown, ImArrowUp } from 'react-icons/im'
import { PostResponse } from '../types/response'
import sanitizeHtml from 'sanitize-html'
import useUpvote from '../lib/client/hooks/post/useUpvote'
import useDownVote from '../lib/client/hooks/post/useDownvote'

interface PostProps {
    data: PostResponse
}

function Post({ data }: PostProps) {
    const { id, author, content, upvotes_count, downvotes_count, created_at, group, is_public } = data
    const totalVoteCount = upvotes_count === 0 && downvotes_count === 0 ? 0 : upvotes_count - downvotes_count

    const { mutate: upvotePost, isLoading: isUpvotingPost } = useUpvote()
    const { mutate: downvotePost, isLoading: isDownvotingPost } = useDownVote()

    return (
        <div className="flex flex-row items-start w-full mb-8">
            <div className="flex flex-col items-center min-w-fit">
                <Link href={`/user/${author.username}`}>
                    <a>
                        <div
                            className="h-9 w-9 bg-cover bg-center bg-sky-200 rounded-full"
                            style={{ backgroundImage: `url("${author.avatar}")` }}
                        />
                    </a>
                </Link>
                <div className="flex flex-col items-center text-slate-400 mt-4 gap-1">
                    <button className="flex" disabled={isUpvotingPost} onClick={() => upvotePost(id)}>
                        <ImArrowUp fontSize={20} className="m-auto p-0.5" />
                    </button>
                    <span className="font-medium">{totalVoteCount}</span>
                    <button className="flex" disabled={isDownvotingPost} onClick={() => downvotePost(id)}>
                        <ImArrowDown fontSize={20} className="m-auto p-0.5" />
                    </button>
                </div>
                <div className="mt-2">
                    <button className="flex text-slate-300">
                        <HiFire fontSize={28} className="m-auto p-0.5" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col ml-3">
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
                <Link href={`/post/${id}`}>
                    <a dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
                </Link>
                <div className="mt-2 text-sm text-slate-400">
                    Posted in{' '}
                    <Link href={`/group/${group.id}`}>
                        <a className="link mr-2">{group.name}</a>
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
                        <HiOutlineChat fontSize={20} className="-ml-1" />{' '}
                        <span className="ml-2 text-sm font-medium">3</span>
                    </button>
                    <button className="button-icon h-8">
                        <HiOutlineBookmark fontSize={20} />
                    </button>
                    <button className="button-icon h-8">
                        <HiOutlineShare fontSize={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Post
