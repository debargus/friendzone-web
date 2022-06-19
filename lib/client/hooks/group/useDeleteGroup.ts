import { useMutation } from 'react-query'
import { client } from '../../index'

const deleteGroup = async (groupId: string) => {
    await client.delete(`/group/${groupId}`)
    return true
}

export default function useDeleteGroup() {
    return useMutation((groupId: string) => deleteGroup(groupId))
}
