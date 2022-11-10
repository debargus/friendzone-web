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
import { detectMobile } from '../../lib/utils/detectDevice'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params, req } = context
    const authenticated = !!req.cookies?.jwt
    const isMobile = detectMobile(req)

    if (!params || !params?.id) {
        return {
            isMobile,
            notFound: true
        }
    }

    try {
        const user = await fetchUserInfo(String(params.id))
        return {
            props: { isMobile, user, authenticated }
        }
    } catch (err) {
        return {
            props: { isMobile, user: null, authenticated }
        }
    }
}

interface UserDetailsProps {
    isMobile: boolean
    user: UserResponse | null
    authenticated: boolean
}

function UserDetails({ isMobile, user, authenticated }: UserDetailsProps) {
    const { data: myInfo } = useMyInfo(authenticated)
    const { data: userPosts, isLoading } = useUserPosts(user?.id)

    if (!user) {
        return <p>User Not Found</p>
    }

    const { name, avatar, description } = user

    return (
        <SEO title={name} description={description} image={avatar ?? ''}>
            <Layout aside={<PopularUsers />} isMobile={isMobile}>
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
