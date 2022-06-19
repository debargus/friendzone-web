import { useState } from 'react'
import Link from 'next/link'
import { EditorState, convertToRaw } from 'draft-js'
import dynamic from 'next/dynamic'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import useMyInfo from '../lib/client/hooks/user/useMyInfo'
import toast from 'react-hot-toast'
import { BiSend } from 'react-icons/bi'

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(({ Editor }) => Editor) as any, {
	ssr: false
}) as typeof Editor

interface ConversationInputProps {
	authenticated: boolean
}

function ConversationInput({ authenticated }: ConversationInputProps) {
	const [editorState, setEditorState] = useState(EditorState.createEmpty())
	const [isEditorFocused, setIsEditorFocused] = useState(false)

	const { data: myInfo } = useMyInfo(authenticated)

	async function handleSendMessage() {
		const editorContent = editorState.getCurrentContent()
		const isEditorEmpty = !editorContent.hasText()

		if (isEditorEmpty) {
			toast.error('Please type something')
			return
		}

		const textMessage = draftToHtml(convertToRaw(editorContent))
		console.log('textMessage', textMessage)
	}

	return (
		<div className="flex items-start gap-4 mt-3 pb-8">
			{myInfo?.username ? (
				<Link href={`/user/${myInfo.username}`}>
					<a>
						<div
							className="h-8 w-8 min-w-[2rem] bg-sky-400 bg-cover bg-center rounded-full"
							style={{ backgroundImage: `url("${myInfo?.avatar}")` }}
						/>
					</a>
				</Link>
			) : (
				<div className="h-8 w-8 min-w-[2rem] bg-sky-400 rounded-full" />
			)}
			<div className="w-full min-h-[4rem]">
				<RichEditor
					stripPastedStyles
					toolbarHidden
					onFocus={() => setIsEditorFocused(true)}
					onBlur={() => setIsEditorFocused(false)}
					editorClassName={`${
						isEditorFocused ? 'border-transparent ring-2 ring-sky-500 ' : ''
					}input h-auto text-sm min-h-[4rem] py-2`}
					editorState={editorState}
					onEditorStateChange={(state) => setEditorState(state)}
				/>
			</div>
			<div>
				<button className="button" onClick={handleSendMessage}>
					<BiSend fontSize={18} className="-ml-1" /> <span className="ml-2">Send</span>
				</button>
			</div>
		</div>
	)
}

export default ConversationInput
