import { useQuery } from 'react-query'
import { PostResponse } from '../../../../types/response'
import { client } from '../../index'

const fetchPosts = async (groupId: string) => {
    const { data } = await client.get(`/post/group/${groupId}/all`)
    return data?.data?.posts
}

export default function useAllPosts(groupId: string) {
    return useQuery<PostResponse[]>(['group_all_posts', groupId], () => fetchPosts(groupId))
}
