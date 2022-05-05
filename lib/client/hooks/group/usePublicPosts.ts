import { useQuery } from 'react-query'
import { PostResponse } from '../../../../types/response'
import { client } from '../../index'

const fetchPosts = async (groupId: string) => {
    const { data } = await client.get(`/post/group/${groupId}/public`)
    return data?.data?.posts
}

export default function usePublicPosts(groupId: string) {
    return useQuery<PostResponse[]>(['group_public_posts', groupId], () => fetchPosts(groupId))
}
