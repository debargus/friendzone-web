import { useMutation } from 'react-query'
import { client } from '../../index'

export interface PostUpdatePayload {
    content: string
    post_id: string
    is_public: boolean
}

const updatePost = async (payload: PostUpdatePayload) => {
    await client.put(`/post/${payload.post_id}/update`, payload)
    return true
}

export default function useUpdatePost() {
    return useMutation((payload: PostUpdatePayload) => updatePost(payload))
}
