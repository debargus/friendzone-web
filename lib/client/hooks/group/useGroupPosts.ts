import { useQuery } from 'react-query'
import { PostResponse } from '../../../../types/response'
import { client } from '../../index'

const fetchPosts = async (groupId: string, authenticated: boolean) => {
    const { data } = await client.get(`/post/group/${groupId}/${authenticated ? 'all' : 'public'}`)
    return data?.data?.posts
}

export default function useGroupPosts(groupId: string, authenticated: boolean) {
    return useQuery<PostResponse[]>(['group_posts', groupId], () => fetchPosts(groupId, authenticated))
}
