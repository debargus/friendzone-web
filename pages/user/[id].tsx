import { GetServerSideProps } from 'next'
import SEO from '../../components/shared/SEO'
import { fetchUserInfo } from '../../lib/client/hooks/user/useUserInfo'
import { UserResponse } from '../../types/response'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context

    if (!params || !params?.id) {
        return {
            notFound: true
        }
    }

    try {
        const user = await fetchUserInfo(String(params.id))
        return {
            props: { user }
        }
    } catch (err) {
        return {
            props: { user: null }
        }
    }
}

interface UserDetailsProps {
    user: UserResponse | null
}

function UserDetails({ user }: UserDetailsProps) {
    if (!user) {
        return <p>User Not Found</p>
    }

    const { name, username } = user

    return (
        <SEO title={name}>
            <div>
                <h2>{name}</h2>
                <p>{username}</p>
            </div>
        </SEO>
    )
}

export default UserDetails
