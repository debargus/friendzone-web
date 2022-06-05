import Image from 'next/image'

interface EmptyComponentProps {
	imgSrc?: string
	title: string
	description?: string
}

function EmptyComponent({ imgSrc = '/assets/images/undraw_no_data.svg', title, description }: EmptyComponentProps) {
	return (
		<div className="py-12 max-w-xs mx-auto text-center">
			<Image width={150} height={100} className="object-contain" src={imgSrc} />
			<h4 className="font-bold text-base text-slate-700 text-center mt-4">{title}</h4>
			{description && <p className="text-slate-500 mt-1 p-0 text-center text-sm">{description}</p>}
		</div>
	)
}

export default EmptyComponent
