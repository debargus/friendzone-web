import React from 'react'
import { ImArrowDown, ImArrowUp } from 'react-icons/im'
import useDownVote from '../lib/client/hooks/post/useDownvote'
import useUpvote from '../lib/client/hooks/post/useUpvote'
import { PostResponse } from '../types/response'

interface PostEngagementProps {
    post: PostResponse
}

function PostEngagement({ post }: PostEngagementProps) {
    const { id, upvotes_count, downvotes_count } = post

    const totalVoteCount = upvotes_count === 0 && downvotes_count === 0 ? 0 : upvotes_count - downvotes_count

    const { mutate: upvotePost, isLoading: isUpvotingPost } = useUpvote()
    const { mutate: downvotePost, isLoading: isDownvotingPost } = useDownVote()

    return (
        <div className="flex flex-col items-center text-slate-400 mt-4 gap-1">
            <button className="flex" disabled={isUpvotingPost} onClick={() => upvotePost(id)}>
                <ImArrowUp fontSize={20} className="m-auto p-0.5" />
            </button>
            <span className="font-medium">{totalVoteCount}</span>
            <button className="flex" disabled={isDownvotingPost} onClick={() => downvotePost(id)}>
                <ImArrowDown fontSize={20} className="m-auto p-0.5" />
            </button>
        </div>
    )
}

export default PostEngagement
