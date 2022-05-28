import { useQuery } from 'react-query'
import { client } from '../../index'
import { GroupResponse } from '../../../../types/response'

const fetchGroups = async () => {
    const { data } = await client.get(`/group/popular`)
    return data?.data?.groups
}

export default function usePopularGroups() {
    return useQuery<GroupResponse[]>('popular_groups', fetchGroups, { staleTime: 60 * 15 * 1000 })
}
