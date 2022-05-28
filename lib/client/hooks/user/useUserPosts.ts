import { useQuery } from 'react-query'
import { PostResponse } from '../../../../types/response'
import { client } from '../../index'

const fetchUserPosts = async (userId?: string) => {
    const { data } = await client.get(`/post/user/${userId}`)
    return data?.data?.posts
}

export default function useUserPosts(userId?: string) {
    return useQuery<PostResponse[]>(['user_posts', userId], () => fetchUserPosts(userId), { enabled: !!userId })
}
