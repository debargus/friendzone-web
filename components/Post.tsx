import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { HiOutlineBookmark, HiOutlineChat, HiOutlineLockClosed, HiOutlineShare } from 'react-icons/hi'
import { PostResponse } from '../types/response'
import sanitizeHtml from 'sanitize-html'
import PostEngagement from './PostEngagement'

interface PostProps {
    data: PostResponse
}

function Post({ data }: PostProps) {
    const { id, author, content, created_at, group, is_public, comments_count } = data

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
                <PostEngagement post={data} />
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
                <Link href={`/post/${id}`}>
                    <a dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
                </Link>
                <div className="mt-0 text-sm text-slate-400">
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
                    <button className="button-icon h-8 pointer-events-none">
                        <HiOutlineChat fontSize={20} className="-ml-1" />{' '}
                        <span className="ml-2 text-sm font-medium">{comments_count}</span>
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
