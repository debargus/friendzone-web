import { useMutation } from 'react-query'
import { client } from '../../index'

export interface PostCreatePayload {
    content: string
    group_id: string
    is_public: boolean
}

const createPost = async (payload: PostCreatePayload) => {
    const { data } = await client.post('/post', payload)
    return data?.data?.post
}

export default function useCreatePost() {
    return useMutation((payload: PostCreatePayload) => createPost(payload))
}
