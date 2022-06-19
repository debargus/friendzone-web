import { useQuery } from 'react-query'
import { PostResponse } from '../../../../types/response'
import { client } from '../../index'

export const fetchPost = async (postId: string) => {
    const { data } = await client.get('/post/' + postId)
    return data?.data?.post
}

export default function usePost(postId: string, initialData?: PostResponse) {
    return useQuery<PostResponse>(['post_details', postId], () => fetchPost(postId), { initialData })
}
