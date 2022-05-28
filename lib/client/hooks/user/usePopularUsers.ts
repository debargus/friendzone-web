import { useQuery } from 'react-query'
import { client } from '../../index'
import { UserResponse } from '../../../../types/response'

const fetchUsers = async () => {
    const { data } = await client.get(`/user/popular`)
    return data?.data?.users
}

export default function usePopularUsers() {
    return useQuery<UserResponse[]>('popular_users', fetchUsers, { staleTime: 60 * 15 * 1000 })
}
