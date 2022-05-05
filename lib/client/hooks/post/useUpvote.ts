import { useMutation } from 'react-query'
import { client } from '../../index'

const upvotePost = async (postId: string) => {
    const { data } = await client.post('/post/upvote', { post_id: postId })
    return data?.data?.upvote
}

export default function useUpvote() {
    return useMutation((postId: string) => upvotePost(postId))
}
