import { useMutation } from 'react-query'
import { client } from '../../index'

const removeBookmark = async (postId: string) => {
    await client.delete(`/post/${postId}/bookmark`)
    return true
}

export default function useRemoveBookmark() {
    return useMutation((postId: string) => removeBookmark(postId))
}
