import React from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'

interface InfoComponentProps {
	text: string
}

function InfoComponent({ text }: InfoComponentProps) {
	return (
		<div className="flex items-center gap-4 bg-sky-100 text-sky-600 px-4 py-3 rounded-md my-4">
			<HiOutlineInformationCircle fontSize={22} />
			<span className="text-sm font-medium">{text}</span>
		</div>
	)
}

export default InfoComponent
