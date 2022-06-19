import { useMutation } from 'react-query'
import { client } from '../../index'

export const unfollowUser = async (userId: string) => {
    await client.post(`/user/${userId}/unfollow`)
    return true
}

export default function useUnfollowUser() {
    return useMutation((userId: string) => unfollowUser(userId))
}
