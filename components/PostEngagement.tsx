import React, { Fragment } from 'react'
import toast from 'react-hot-toast'
import { HiFire } from 'react-icons/hi'
import { ImArrowDown, ImArrowUp } from 'react-icons/im'
import useAddHot from '../lib/client/hooks/post/useAddHot'
import useDownVote from '../lib/client/hooks/post/useDownvote'
// import useRemoveHot from '../lib/client/hooks/post/useRemoveHot'
import useUpvote from '../lib/client/hooks/post/useUpvote'
import { PostResponse } from '../types/response'

interface PostEngagementProps {
    post: PostResponse
}

function PostEngagement({ post }: PostEngagementProps) {
    const { id, upvotes_count, downvotes_count, hots_count } = post

    const totalVoteCount = upvotes_count === 0 && downvotes_count === 0 ? 0 : upvotes_count - downvotes_count

    const { mutate: upvotePost, isLoading: isUpvotingPost } = useUpvote()
    const { mutate: downvotePost, isLoading: isDownvotingPost } = useDownVote()
    const { mutateAsync: addHot, isLoading: isAddingHot } = useAddHot()
    // const { mutate: removeHot, isLoading: isRemovingHot } = useRemoveHot()

    async function handleHotClick() {
        try {
            await addHot(id)
            toast.success('Post marked as Hot')
        } catch (err) {
            toast.error('Post could not be marked as Hot')
        }
    }

    return (
        <Fragment>
            <div className="flex flex-col items-center text-slate-400 mt-4 gap-1">
                <button className="flex" disabled={isUpvotingPost} onClick={() => upvotePost(id)}>
                    <ImArrowUp fontSize={20} className="m-auto p-0.5" />
                </button>
                <span className="font-medium">{totalVoteCount}</span>
                <button className="flex" disabled={isDownvotingPost} onClick={() => downvotePost(id)}>
                    <ImArrowDown fontSize={20} className="m-auto p-0.5" />
                </button>
            </div>
            <div className="mt-2 relative">
                <button
                    className="flex text-slate-300"
                    disabled={isAddingHot}
                    onClick={handleHotClick}
                    title="Mark post as Hot"
                >
                    <HiFire fontSize={28} className="m-auto p-0.5" />
                </button>
                {!!hots_count && (
                    <span
                        className="text-xs absolute bg-slate-400 font-semibold text-white px-1.5 rounded-md"
                        style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
                    >
                        {hots_count}
                    </span>
                )}
            </div>
        </Fragment>
    )
}

export default PostEngagement
