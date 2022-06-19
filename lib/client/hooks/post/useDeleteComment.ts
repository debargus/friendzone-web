import { useMutation } from 'react-query'
import { client } from '../../index'

const deleteComment = async (commentId: string) => {
    await client.delete('/post/comment/' + commentId)
    return true
}

export default function useDeleteComment() {
    return useMutation((commentId: string) => deleteComment(commentId))
}
