import GroupMiniView from '../../components/GroupMiniView'
import PopularUsers from '../../components/PopularUsers'
import Layout from '../../components/shared/Layout'
import SEO from '../../components/shared/SEO'
import usePopularGroups from '../../lib/client/hooks/group/usePopularGroups'

function Groups() {
    const { data, isLoading } = usePopularGroups()

    return (
        <SEO title="Trending Groups">
            <Layout aside={<PopularUsers />}>
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

export default Groups
