import Link from 'next/link'
import usePopularUsers from '../lib/client/hooks/user/usePopularUsers'

interface PopularUsersProps {}

function PopularUsers({}: PopularUsersProps) {
    const { data, isLoading } = usePopularUsers()

    return (
        <div className="flex flex-col w-72 px-4">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold  text-sm">Top Users</h2>
                    <Link href="/trending/groups">
                        <a className="text-sky-500 text-sm font-semibold">See all</a>
                    </Link>
                </div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    data?.map((user) => (
                        <Link href={`/user/${user.username}`} key={user.id}>
                            <a className="flex flex-row items-center mt-3 pr-2">
                                <div
                                    className="h-9 w-9 bg-cover bg-center bg-sky-200 rounded-full"
                                    style={{ backgroundImage: `url("${user.avatar}")` }}
                                />
                                <div className="flex flex-col ml-3 text-sm ">
                                    <strong className="whitespace-nowrap font-medium text-slate-700 text-ellipsis overflow-hidden">
                                        {user.name}
                                    </strong>
                                    <span className="text-xs font-medium text-slate-400">@{user.username}</span>
                                </div>
                            </a>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default PopularUsers
