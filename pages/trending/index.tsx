import { GetServerSideProps } from 'next'
import GroupMiniView from '../../components/GroupMiniView'
import PopularUsers from '../../components/PopularUsers'
import Layout from '../../components/shared/Layout'
import SEO from '../../components/shared/SEO'
import usePopularGroups from '../../lib/client/hooks/group/usePopularGroups'
import { detectMobile } from '../../lib/utils/detectDevice'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context
    const isMobile = detectMobile(req)

    return {
        props: { isMobile }
    }
}

interface TrendingProps {
    isMobile: boolean
}

function Trending({ isMobile }: TrendingProps) {
    const { data, isLoading } = usePopularGroups()

    return (
        <SEO title="Trending">
            <Layout aside={<PopularUsers />} isMobile={isMobile}>
                <h3 className="font-semibold text-slate-700">Trending Groups</h3>
                <div className="mt-5 grid grid-cols-2 gap-6">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        data?.map((group) => <GroupMiniView key={group.id} group={group} />)
                    )}
                </div>
            </Layout>
        </SEO>
    )
}

export default Trending
