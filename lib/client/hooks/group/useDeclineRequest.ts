import { useMutation } from 'react-query'
import { client } from '../../index'

interface RequestDeclinePayload {
    group_id: string
    request_user_id: string
}

const declineRequest = async (payload: RequestDeclinePayload) => {
    await client.post('/group/decline', payload)
    return true
}

export default function useDeclineRequest() {
    return useMutation((payload: RequestDeclinePayload) => declineRequest(payload))
}
