import classNames from 'classnames'
import { format } from 'date-fns'
import Link from 'next/link'
import { UserResponse } from '../types/response'

interface ConversationMessageProps {
	message: string
	timestamp: string
	messageType: 'INBOUND' | 'OUTBOUND'
	userInfo: UserResponse
}

function ConversationMessage({ message, messageType, timestamp, userInfo }: ConversationMessageProps) {
	return (
		<div
			className={classNames(
				messageType === 'OUTBOUND' ? 'flex-row-reverse' : 'flex-row',
				'flex items-start gap-2'
			)}
		>
			<Link href={`/user/${userInfo?.username}`}>
				<a>
					<div
						className="h-6 w-6 min-w-[1.5rem] bg-sky-400 bg-cover bg-center rounded-full"
						style={{ backgroundImage: `url("${userInfo?.avatar}")` }}
					/>
				</a>
			</Link>
			<div className="flex flex-col items-start">
				<div
					className={classNames(
						messageType === 'OUTBOUND' ? 'bg-slate-200' : 'bg-sky-500 text-white',
						'px-3 py-2 rounded-lg text-sm max-w-sm'
					)}
				>
					{message}
				</div>
				<div className="text-xs text-slate-500 pr-1 pt-1 w-full text-right">
					<span>{format(new Date(timestamp), 'hh:mm aaa')}</span>
				</div>
			</div>
		</div>
	)
}

export default ConversationMessage
