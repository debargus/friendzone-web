import { useMutation } from 'react-query'
import { client } from '../../index'

export interface PostCommentPayload {
    comment_text: string
    post_id: string
}

const postComment = async (payload: PostCommentPayload) => {
    const { data } = await client.post(`/post/comment`, payload)
    return data?.data?.comment
}

export default function useCommentPost() {
    return useMutation((payload: PostCommentPayload) => postComment(payload))
}
