import { useMutation } from 'react-query'
import { UserUpdatePayload } from '../../../../types/response'
import { client } from '../../index'

const updateInfo = async (payload: UserUpdatePayload) => {
    await client.put('/user/me/update', payload)
    return true
}

export default function useUpdateMyInfo() {
    return useMutation((payload: UserUpdatePayload) => updateInfo(payload))
}
