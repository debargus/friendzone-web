import { useMutation } from 'react-query'
import { client } from '../../index'

const downvotePost = async (postId: string) => {
    const { data } = await client.post('/post/downvote', { post_id: postId })
    return data?.data?.downvote
}

export default function useDownVote() {
    return useMutation((postId: string) => downvotePost(postId))
}
