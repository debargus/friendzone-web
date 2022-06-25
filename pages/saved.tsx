import PopularGroups from '../components/PopularGroups'
import Post from '../components/Post'
import EmptyComponent from '../components/shared/EmptyComponent'
import Layout from '../components/shared/Layout'
import SEO from '../components/shared/SEO'
import useBookmarkedPosts from '../lib/client/hooks/post/useBookmarkedPosts'

function Saved() {
    const { data, isLoading } = useBookmarkedPosts()

    return (
        <SEO title="Saved Posts">
            <Layout aside={<PopularGroups />}>
                <h3 className="font-semibold text-slate-700">Saved Posts</h3>
                <div className="mt-5">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : data?.length ? (
                        data.map((bookmark) => <Post data={bookmark.post!} key={bookmark.id} />)
                    ) : (
                        <EmptyComponent title="No posts here!" description="There are no saved posts" />
                    )}
                </div>
            </Layout>
        </SEO>
    )
}

export default Saved
