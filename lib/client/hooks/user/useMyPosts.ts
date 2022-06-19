import { useQuery } from 'react-query'
import { PostResponse } from '../../../../types/response'
import { client } from '../../index'

const fetchMyPosts = async () => {
    const { data } = await client.get('/post/myposts')
    return data?.data?.posts
}

export default function useMyPosts() {
    return useQuery<PostResponse[]>('my_posts', fetchMyPosts)
}
