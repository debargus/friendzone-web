import { GetServerSideProps } from 'next'
import ProfileHeader from '../../components/ProfileHeader'
import SEO from '../../components/shared/SEO'
import { fetchUserInfo } from '../../lib/client/hooks/user/useUserInfo'
import { UserResponse } from '../../types/response'
import Post from '../../components/Post'
import useUserPosts from '../../lib/client/hooks/user/useUserPosts'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'
import Layout from '../../components/shared/Layout'
import PopularUsers from '../../components/PopularUsers'
import EmptyComponent from '../../components/shared/EmptyComponent'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params, req } = context
    const authenticated = !!req.cookies?.jwt

    if (!params || !params?.id) {
        return {
            notFound: true
        }
    }

    try {
        const user = await fetchUserInfo(String(params.id))
        return {
            props: { user, authenticated }
        }
    } catch (err) {
        return {
            props: { user: null, authenticated }
        }
    }
}

interface UserDetailsProps {
    user: UserResponse | null
    authenticated: boolean
}

function UserDetails({ user, authenticated }: UserDetailsProps) {
    const { data: myInfo } = useMyInfo(authenticated)
    const { data: userPosts, isLoading } = useUserPosts(user?.id)

    if (!user) {
        return <p>User Not Found</p>
    }

    const { name, avatar, description } = user

    return (
        <SEO title={name} description={description} image={avatar ?? ''}>
            <Layout aside={<PopularUsers />}>
                <ProfileHeader profileData={user} isMyProfile={myInfo?.id === user.id} />
                <div className="my-8">
                    <h3 className="font-semibold text-slate-700">Recent Posts</h3>
                    <div className="mt-5">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : userPosts?.length ? (
                            userPosts.map((post) => <Post key={post.id} data={post} />)
                        ) : (
                            <EmptyComponent title="No posts here!" description={`${name} hasn't posted anything yet`} />
                        )}
                    </div>
                </div>
            </Layout>
        </SEO>
    )
}

export default UserDetails
