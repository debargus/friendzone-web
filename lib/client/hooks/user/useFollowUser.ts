import { useMutation } from 'react-query'
import { client } from '../../index'

export const followUser = async (userId: string) => {
    await client.post(`/user/${userId}/follow`)
    return true
}

export default function useFollowUser() {
    return useMutation((userId: string) => followUser(userId))
}
