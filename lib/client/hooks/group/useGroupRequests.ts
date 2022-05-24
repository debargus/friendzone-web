import { useQuery } from 'react-query'
import { UserResponse } from '../../../../types/response'
import { client } from '../../index'

const getGroupRequests = async (groupId: string) => {
    const { data } = await client.get(`/group/${groupId}/requests`)
    return data?.data.group_requests
}

export default function useGroupRequests(groupId: string, isAdmin?: boolean) {
    return useQuery<UserResponse[]>(['group_requests', groupId], () => getGroupRequests(groupId), {
        enabled: !!isAdmin
    })
}
