import { useQuery } from 'react-query'
import { BookmarkResponse } from '../../../../types/response'
import { client } from '../../index'

const getBookmarkedPosts = async () => {
    const { data } = await client.get('/post/mybookmarks')
    return data?.data.bookmarks
}

export default function useBookmarkedPosts() {
    return useQuery<BookmarkResponse[]>('my_bookmarks', () => getBookmarkedPosts())
}
