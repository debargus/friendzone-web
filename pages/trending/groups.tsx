import GroupMiniView from '../../components/GroupMiniView'
import usePopularGroups from '../../lib/client/hooks/group/usePopularGroups'

function Groups() {
    const { data, isLoading } = usePopularGroups()

    return (
        <div className="mb-6">
            <h3 className="font-semibold text-slate-700">Trending Groups</h3>
            <div className="mt-5 grid grid-cols-2 gap-6">
                {isLoading ? <p>Loading...</p> : data?.map((group) => <GroupMiniView key={group.id} group={group} />)}
            </div>
        </div>
    )
}

export default Groups
