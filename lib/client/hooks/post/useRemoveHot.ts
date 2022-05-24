import { useMutation } from 'react-query'
import { client } from '../../index'

const removeHot = async (postId: string) => {
    await client.delete(`/post/${postId}/hot`)
    return true
}

export default function useRemoveHot() {
    return useMutation((postId: string) => removeHot(postId))
}
