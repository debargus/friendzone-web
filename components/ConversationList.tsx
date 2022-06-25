import classNames from 'classnames'
import usePopularUsers from '../lib/client/hooks/user/usePopularUsers'

interface ConversationListProps {
	activeId?: string
	handleSetActiveId: (id: string) => void
}

function ConversationList({ activeId, handleSetActiveId }: ConversationListProps) {
	const { data, isLoading } = usePopularUsers()

	return (
		<div className="min-w-[18rem] flex flex-col">
			<h3 className="font-semibold text-slate-700">Messages</h3>
			<div className="mt-3">
				<input
					type="text"
					placeholder="Search..."
					className="text-sm focus:outline-none active:outline-none bg-slate-100 border border-slate-200 focus:border-transparent focus:border-transparent focus:bg-transparent ring-0 focus:ring-2 ring-sky-500 h-9 px-3 w-full rounded-md"
				/>
			</div>
			<div className="mt-4">
				{isLoading ? (
					<p>Loading...</p>
				) : (
					data?.map((user) => (
						<div
							key={user.id}
							className={classNames(
								activeId === user.id && 'bg-slate-100',
								'flex flex-row gap-3 items-center px-2 py-2 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-200 rounded-md cursor-pointer'
							)}
							onClick={() => handleSetActiveId(user.id)}
						>
							<div
								className="h-7 min-w-[1.75rem] bg-cover bg-center bg-sky-200 rounded-full"
								style={{ backgroundImage: `url("${user.avatar}")` }}
							/>
							<span
								className={classNames(
									activeId === user.id
										? 'font-semibold text-slate-800'
										: 'font-medium text-slate-600',
									'text-sm'
								)}
							>
								{user.name}
							</span>
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default ConversationList
