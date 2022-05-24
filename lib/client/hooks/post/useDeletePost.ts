import { useMutation } from 'react-query'
import { client } from '../../index'

const deletePost = async (postId: string) => {
    await client.delete('/post/' + postId)
    return true
}

export default function useDeletePost() {
    return useMutation((postId: string) => deletePost(postId))
}
