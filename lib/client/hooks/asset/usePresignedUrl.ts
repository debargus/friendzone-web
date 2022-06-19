import { client } from '../../index'

const fetchPresignedUrl = async () => {
    const { data } = await client.get(`/getuploadurl`)
    return data?.data?.url
}

export default function usePresignedUrl() {
    return fetchPresignedUrl
}
