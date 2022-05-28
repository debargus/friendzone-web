import { GetServerSideProps } from 'next'
import Post from '../components/Post'
import EmptyComponent from '../components/shared/EmptyComponent'
import Layout from '../components/shared/Layout'
import SEO from '../components/shared/SEO'
import useAllPosts from '../lib/client/hooks/post/useAllPosts'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context
    const authenticated = !!req.cookies?.jwt

    return {
        props: { authenticated }
    }
}

interface IndexPageProps {
    authenticated: boolean
}

function IndexPage({ authenticated }: IndexPageProps) {
    const { data, isLoading } = useAllPosts(authenticated)

    return (
        <SEO>
            <Layout>
                <h3 className="font-semibold text-slate-700">Recent Posts</h3>
                <div className="mt-5">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : data?.length ? (
                        data.map((post) => <Post key={post.id} data={post} />)
                    ) : (
                        <EmptyComponent title="No posts here!" description="There are no recommended posts" />
                    )}
                </div>
            </Layout>
        </SEO>
    )
}

export default IndexPage
