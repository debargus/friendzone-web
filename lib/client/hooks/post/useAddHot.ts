import { useMutation } from 'react-query'
import { client } from '../../index'

const addHot = async (postId: string) => {
    const { data } = await client.post(`/post/${postId}/hot`)
    return data?.data.hot
}

export default function useAddHot() {
    return useMutation((postId: string) => addHot(postId))
}
