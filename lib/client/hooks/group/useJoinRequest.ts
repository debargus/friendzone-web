import { useMutation } from 'react-query'
import { client } from '../../index'

const sendJoinRequest = async (groupId: string) => {
    await client.post('/group/join', { group_id: groupId })
    return true
}

export default function useJoinRequest() {
    return useMutation((groupId: string) => sendJoinRequest(groupId))
}
