import classNames from 'classnames'
import React from 'react'
import { ImArrowDown, ImArrowUp } from 'react-icons/im'
import useDownVote from '../lib/client/hooks/post/useDownvote'
import useUpvote from '../lib/client/hooks/post/useUpvote'
import { PostResponse } from '../types/response'

interface PostEngagementProps {
    post: PostResponse
    onActionComplete?: () => void
}

function PostEngagement({ post, onActionComplete }: PostEngagementProps) {
    const { id, upvotes_count, downvotes_count, my_upvote, my_downvote } = post

    const { mutateAsync: upvotePost, isLoading: isUpvotingPost } = useUpvote()
    const { mutateAsync: downvotePost, isLoading: isDownvotingPost } = useDownVote()

    async function handleUpvote() {
        if (!!my_upvote) return
        await upvotePost(id)
        if (onActionComplete) onActionComplete()
    }

    async function handleDownvote() {
        if (!!my_downvote) return
        await downvotePost(id)
        if (onActionComplete) onActionComplete()
    }

    return (
        <div className="flex flex-col items-center text-slate-400 mt-4 gap-1">
            <button
                className={classNames(!!my_upvote && 'text-sky-500', 'flex')}
                disabled={isUpvotingPost}
                onClick={handleUpvote}
            >
                <ImArrowUp fontSize={20} className="m-auto p-0.5" />
            </button>
            {upvotes_count ? (
                <span className="font-medium">+{upvotes_count}</span>
            ) : downvotes_count ? (
                <span className="font-medium">-{downvotes_count}</span>
            ) : (
                <span className="font-medium">0</span>
            )}
            <button
                className={classNames(!!my_downvote && 'text-orange-500', 'flex')}
                disabled={isDownvotingPost}
                onClick={handleDownvote}
            >
                <ImArrowDown fontSize={20} className="m-auto p-0.5" />
            </button>
        </div>
    )
}

export default PostEngagement
