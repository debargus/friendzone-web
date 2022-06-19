import { useMutation } from 'react-query'
import { client } from '../../index'

interface RequestApprovePayload {
    group_id: string
    request_user_id: string
}

const approveRequest = async (payload: RequestApprovePayload) => {
    await client.post('/group/approve', payload)
    return true
}

export default function useApproveRequest() {
    return useMutation((payload: RequestApprovePayload) => approveRequest(payload))
}
