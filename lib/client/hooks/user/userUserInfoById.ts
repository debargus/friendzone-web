import { useQuery } from 'react-query'
import { UserResponse } from '../../../../types/response'
import { client } from '../../index'

export const fetchUserInfo = async (userId?: string) => {
    const { data } = await client.get(`/user/id/${userId}`)
    return data?.data?.user
}

export default function userUserInfoById(userId?: string) {
    return useQuery<UserResponse>(['user_info', userId], () => fetchUserInfo(userId), {
        enabled: !!userId,
        staleTime: 1000 * 60 * 5
    })
}
