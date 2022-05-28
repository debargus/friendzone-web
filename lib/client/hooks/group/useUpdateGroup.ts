import { useMutation } from 'react-query'
import { GroupUpdatePayload } from '../../../../types/response'
import { client } from '../../index'

const updateGroup = async (payload: GroupUpdatePayload) => {
    await client.put(`/group/${payload.id}/update`, payload)
    return true
}

export default function useUpdateGroup() {
    return useMutation((payload: GroupUpdatePayload) => updateGroup(payload))
}
