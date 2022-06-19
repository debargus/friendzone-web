import { useQuery } from 'react-query'
import { GroupResponse } from '../../../../types/response'
import { client } from '../../index'

interface UserGroupResponse {
    groups: GroupResponse[]
    requests: GroupResponse[]
}

export const fetchUserGroups = async (userId?: string) => {
    const { data } = await client.get(`user/${userId}/groups`)
    return data?.data
}

export default function useUserGroups(userId?: string) {
    return useQuery<UserGroupResponse>(['user_groups', userId], () => fetchUserGroups(userId), {
        enabled: !!userId,
        staleTime: 5 * 60 * 1000
    })
}
