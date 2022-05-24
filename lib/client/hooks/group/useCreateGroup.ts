import { useMutation } from 'react-query'
import { GroupCreatePayload } from '../../../../types/response'
import { client } from '../../index'

const createGroup = async (payload: GroupCreatePayload) => {
    const { data } = await client.post('/group', payload)
    return data?.data?.group
}

export default function useCreateGroup() {
    return useMutation((payload: GroupCreatePayload) => createGroup(payload))
}
