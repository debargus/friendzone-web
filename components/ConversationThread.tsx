import { Fragment } from 'react'
import useMyInfo from '../lib/client/hooks/user/useMyInfo'
import userUserInfoById from '../lib/client/hooks/user/userUserInfoById'
import ConversationInput from './ConversationInput'
import ConversationMessage from './ConversationMessage'
import EmptyComponent from './shared/EmptyComponent'

interface ConversationThreadProps {
	authenticated: boolean
	activeId?: string
}

function ConversationThread({ authenticated, activeId }: ConversationThreadProps) {
	const { data: userInfo } = userUserInfoById(activeId)
	const { data: myInfo } = useMyInfo(authenticated)

	if (!activeId)
		return (
			<div className="w-full flex items-center justify-center pb-20">
				<EmptyComponent
					imgSrc="/assets/images/undraw_quick_chat.svg"
					title="No Chat Selected"
					description="Select a chat to start conversation"
				/>
			</div>
		)

	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			<div className="rounded-md bg-slate-50 flex-1 flex flex-col pl-4 ml-4 pr-4 py-6 my-1 gap-4 min-h-0 overflow-y-auto ">
				{userInfo && myInfo && (
					<Fragment>
						<ConversationMessage
							message="😃"
							messageType="INBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={userInfo}
						/>
						<ConversationMessage
							message="Hello! How are you bro?"
							messageType="INBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={userInfo}
						/>
						<ConversationMessage
							message="Tell me what is going on?"
							messageType="INBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={userInfo}
						/>
						<ConversationMessage
							message="I am fine. How are you?"
							messageType="OUTBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={myInfo}
						/>
						<ConversationMessage
							message="Just finishing with some work. I am trying to get the Socket.io working with Node.js Express. I am trying get idea from the offical documentation."
							messageType="OUTBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={myInfo}
						/>
						<ConversationMessage
							message="Nice!"
							messageType="INBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={userInfo}
						/>
						<ConversationMessage
							message="Just finishing with some work. I am trying to get the Socket.io working with Node.js Express. I am trying get idea from the offical documentation."
							messageType="OUTBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={myInfo}
						/>
						<ConversationMessage
							message="Nice!"
							messageType="INBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={userInfo}
						/>
						<ConversationMessage
							message="Just emailed you some info. Let me know once you have checked."
							messageType="INBOUND"
							timestamp="2022-05-31T07:12:02.908Z"
							userInfo={userInfo}
						/>
					</Fragment>
				)}
			</div>
			<div className="pl-4 pr-2">
				<ConversationInput authenticated={authenticated} />
			</div>
		</div>
	)
}

export default ConversationThread

// <div className="flex items-center justify-between">
// 	<Link href={`/user/${userInfo.username}`}>
// 		<a className="flex flex-row items-center pr-2">
// 			<div
// 				className="h-11 w-11 bg-cover bg-center bg-sky-200 rounded-full"
// 				style={{ backgroundImage: `url("${userInfo.avatar}")` }}
// 			/>
// 			<div className="flex flex-col ml-3">
// 				<strong className="whitespace-nowrap font-medium text-slate-700 text-ellipsis overflow-hidden">
// 					{userInfo.name}
// 				</strong>
// 				<span className="text-sm font-medium text-slate-400">@{userInfo.username}</span>
// 			</div>
// 		</a>
// 	</Link>
// 	<Link href={`/user/${userInfo.username}`}>
// 		<a className="button-light">View Profile</a>
// 	</Link>
// </div>
