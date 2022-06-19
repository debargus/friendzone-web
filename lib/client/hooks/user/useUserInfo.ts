import { useQuery } from 'react-query'
import { UserResponse } from '../../../../types/response'
import { client } from '../../index'

export const fetchUserInfo = async (userId?: string) => {
    const { data } = await client.get(`/user/${userId}`)
    return data?.data?.user
}

export default function useUserInfo(userId?: string) {
    return useQuery<UserResponse>(['user_info', userId], () => fetchUserInfo(userId), {
        enabled: !!userId,
        staleTime: 1000 * 60 * 5
    })
}
