import { useMutation } from 'react-query'
import { client } from '../../index'

const addBookmark = async (postId: string) => {
    const { data } = await client.post(`/post/${postId}/bookmark`)
    return data?.data.bookmark
}

export default function useAddBookmark() {
    return useMutation((postId: string) => addBookmark(postId))
}
