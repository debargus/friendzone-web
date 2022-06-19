import Link from 'next/link'
import usePopularGroups from '../lib/client/hooks/group/usePopularGroups'

interface PopularGroupsProps {}

function PopularGroups({}: PopularGroupsProps) {
    const { data, isLoading } = usePopularGroups()

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold  text-sm">Explore Groups</h2>
                <Link href="/trending/groups">
                    <a className="text-sky-500 text-sm font-semibold">See all</a>
                </Link>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                data?.map((group) => (
                    <Link href={`/group/${group.id}`} key={group.id}>
                        <a className="flex flex-row items-center mt-3 pr-2 overflow-hidden">
                            <img src={group.display_image} alt={group.name} className="w-9 h-9 rounded-md" />
                            <div className="flex flex-col ml-3 text-sm overflow-hidden">
                                <strong className="whitespace-nowrap font-medium text-slate-700 text-ellipsis overflow-hidden">
                                    {group.name}
                                </strong>
                                <span className="text-xs font-medium text-slate-400">
                                    {group.members_count} members
                                </span>
                            </div>
                        </a>
                    </Link>
                ))
            )}
        </div>
    )
}

export default PopularGroups
