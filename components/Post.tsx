import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { HiFire, HiOutlineChat, HiOutlineLockClosed, HiOutlineShare } from 'react-icons/hi'
import { MdOutlineBookmark, MdOutlineBookmarkBorder } from 'react-icons/md'
import { PostResponse } from '../types/response'
import sanitizeHtml from 'sanitize-html'
import PostEngagement from './PostEngagement'
import useAddHot from '../lib/client/hooks/post/useAddHot'
import toast from 'react-hot-toast'
import useRemoveHot from '../lib/client/hooks/post/useRemoveHot'
import classNames from 'classnames'
import useAddBookmark from '../lib/client/hooks/post/useAddBookmark'
import useRemoveBookmark from '../lib/client/hooks/post/useRemoveBookmark'

interface PostProps {
    data: PostResponse
}

function Post({ data }: PostProps) {
    const {
        id,
        author,
        content,
        created_at,
        group,
        is_public,
        comments_count,
        hots_count,
        is_updated,
        my_hot,
        my_bookmark
    } = data

    const { mutateAsync: addHot, isLoading: isAddingHot } = useAddHot()
    const { mutateAsync: removeHot, isLoading: isRemovingHot } = useRemoveHot()
    const { mutateAsync: addBookmark, isLoading: isAddingBookmark } = useAddBookmark()
    const { mutateAsync: removeBookmark, isLoading: isRemovingBookmark } = useRemoveBookmark()

    async function handleHotClick() {
        try {
            if (!!my_hot) {
                await removeHot(id)
            } else {
                await addHot(id)
            }
        } catch (err) {
            toast.error('Something went wrong!')
        }
    }

    async function handleBookmarkClick() {
        try {
            if (!!my_bookmark) {
                await removeBookmark(id)
            } else {
                await addBookmark(id)
            }
        } catch (err) {
            toast.error('Something went wrong!')
        }
    }

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
                        {formatDistanceToNow(new Date(created_at), { addSuffix: true })} {is_updated && '(edited)'}
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
                    <button
                        className={classNames(!!my_hot ? 'text-orange-500' : 'text-slate-500', 'button-icon h-8')}
                        onClick={handleHotClick}
                        disabled={isAddingHot || isRemovingHot}
                    >
                        <HiFire fontSize={20} className="-ml-1" />
                        <span className="ml-1 text-sm font-medium">{hots_count}</span>
                    </button>
                    <Link href={`/post/${id}`}>
                        <button className="button-icon h-8">
                            <HiOutlineChat fontSize={20} className="text-slate-500 -ml-1" />
                            <span className="ml-1 text-sm font-medium">{comments_count}</span>
                        </button>
                    </Link>
                    <button
                        className={classNames(!!my_bookmark ? 'text-orange-500' : 'text-slate-500', 'button-icon h-8')}
                        onClick={handleBookmarkClick}
                        disabled={isAddingBookmark || isRemovingBookmark}
                    >
                        {!!my_bookmark ? (
                            <MdOutlineBookmark fontSize={22} />
                        ) : (
                            <MdOutlineBookmarkBorder fontSize={22} />
                        )}
                    </button>
                    <button className="button-icon h-8">
                        <HiOutlineShare fontSize={20} className="text-slate-500" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Post
