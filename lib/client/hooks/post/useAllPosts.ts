import { useQuery } from 'react-query'
import { PostResponse } from '../../../../types/response'
import { client } from '../../index'

const fetchAllPosts = async (authenticated: boolean) => {
    const { data } = await client.get(authenticated ? '/post/all' : '/post/public')
    return data?.data?.posts
}

export default function useAllPosts(authenticated: boolean) {
    return useQuery<PostResponse[]>('all_posts', () => fetchAllPosts(authenticated))
}
