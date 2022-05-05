import { useQuery } from 'react-query'
import { UserResponse } from '../../../../types/response'
import { client } from '../../index'

const fetchMyInfo = async () => {
    const { data } = await client.get(`/user/me`)
    return data?.data?.user
}

export default function useMyInfo(authenticated: boolean) {
    return useQuery<UserResponse>('my_info', fetchMyInfo, { enabled: authenticated })
}
