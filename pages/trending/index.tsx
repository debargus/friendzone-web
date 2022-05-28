import GroupMiniView from '../../components/GroupMiniView'
import Layout from '../../components/shared/Layout'
import usePopularGroups from '../../lib/client/hooks/group/usePopularGroups'

function Trending() {
    const { data, isLoading } = usePopularGroups()

    return (
        <div className="mb-6">
            <Layout>
                <h3 className="font-semibold text-slate-700">Trending Groups</h3>
                <div className="mt-5 grid grid-cols-2 gap-6">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        data?.map((group) => <GroupMiniView key={group.id} group={group} />)
                    )}
                </div>
            </Layout>
        </div>
    )
}

export default Trending
