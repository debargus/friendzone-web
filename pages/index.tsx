import { GetServerSideProps } from 'next'
import PopularGroups from '../components/PopularGroups'
import Post from '../components/Post'
import EmptyComponent from '../components/shared/EmptyComponent'
import Layout from '../components/shared/Layout'
import SEO from '../components/shared/SEO'
import useAllPosts from '../lib/client/hooks/post/useAllPosts'
import { detectMobile } from '../lib/utils/detectDevice'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context
    const authenticated = !!req.cookies?.jwt
    const isMobile = detectMobile(req)

    return {
        props: { authenticated, isMobile }
    }
}

interface IndexPageProps {
    isMobile: boolean
    authenticated: boolean
}

function IndexPage({ isMobile, authenticated }: IndexPageProps) {
    const { data, isLoading } = useAllPosts(authenticated)

    return (
        <SEO title="Home">
            <Layout aside={<PopularGroups />} isMobile={isMobile}>
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
