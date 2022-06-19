import { client } from '../../index'

const upload = async (presignedUrl: string, imageBlob: Blob) => {
    await client.put(presignedUrl, imageBlob, { withCredentials: false })
    const requestUrl = presignedUrl.split('?')[0]
    return process.env.NEXT_PUBLIC_CLOUDFRONT_URL! + requestUrl.split('/')[3]
}

export default function useUploadImage() {
    return upload
}
