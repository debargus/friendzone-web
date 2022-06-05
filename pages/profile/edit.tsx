import { Dialog, Transition } from '@headlessui/react'
import { GetServerSideProps } from 'next'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineCamera, HiOutlinePhotograph } from 'react-icons/hi'
import ReactCrop, { Crop } from 'react-image-crop'
import usePresignedUrl from '../../lib/client/hooks/asset/usePresignedUrl'
import useUploadImage from '../../lib/client/hooks/asset/useUploadImage'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'
import { getCroppedImg } from '../../lib/utils/getCroppedImg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import dynamic from 'next/dynamic'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import SEO from '../../components/shared/SEO'
import { UserUpdatePayload } from '../../types/response'
import useUpdateMyInfo from '../../lib/client/hooks/user/useUpdateMyInfo'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'
import Layout from '../../components/shared/Layout'
import PopularGroups from '../../components/PopularGroups'

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(({ Editor }) => Editor) as any, {
	ssr: false
}) as typeof Editor

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { req } = context
	const authenticated = !!req.cookies?.jwt

	if (!authenticated) {
		return {
			redirect: {
				destination: '/auth/login',
				permanent: false
			}
		}
	}

	return {
		props: {
			authenticated
		}
	}
}

const cropDimensions: Crop = { x: 0, y: 0, width: 400, height: 100, unit: 'px' }

function EditProfile({ authenticated }: { authenticated: boolean }) {
	const [fullName, setFullName] = useState('')
	const [editorState, setEditorState] = useState(EditorState.createEmpty())
	const [isEditorFocused, setIsEditorFocused] = useState(false)
	const [cropModalData, setCropModalData] = useState<{ file: File; type: 'DISPLAY' | 'COVER' } | null>(null)
	const [crop, setCrop] = useState<Crop>(cropDimensions)
	const [imageSrc, setImageSrc] = useState<string>()
	const imgRef = useRef<HTMLImageElement>(null)
	const router = useRouter()
	const queryClient = useQueryClient()
	const [submitDisabled, setSubmitDisabled] = useState(false)

	const [croppedCoverImg, setCroppedCoverImg] = useState<string>()
	const [croppedDisplayImg, setCroppedDisplayImg] = useState<string>()
	const [croppedCoverBlob, setCroppedCoverBlob] = useState<Blob>()
	const [croppedDisplayBlob, setCroppedDisplayBlob] = useState<Blob>()

	const { data: myInfo, isLoading: isMyInfoLoading } = useMyInfo(authenticated)
	const getPresignedUrl = usePresignedUrl()
	const uploadImage = useUploadImage()
	const { mutateAsync: updateProfile, isLoading: isUpdatingProfile } = useUpdateMyInfo()

	async function handleSelectImage(e: any, type: 'DISPLAY' | 'COVER'): Promise<void> {
		const selectedFile = e.target.files[0]
		const fileType = selectedFile.type.substr(0, 5)

		if (fileType !== 'image') toast.error('Please select a valid image file')

		setImageSrc(URL.createObjectURL(selectedFile))
		setCropModalData({ file: selectedFile, type })
	}

	async function handleImageCrop() {
		if (!imgRef.current) return
		const { base64Image, imgBlob } = await getCroppedImg(imgRef.current, crop)

		if (cropModalData?.type === 'COVER') {
			setCroppedCoverImg(base64Image)
			setCroppedCoverBlob(imgBlob)
		} else {
			setCroppedDisplayImg(base64Image)
			setCroppedDisplayBlob(imgBlob)
		}

		setCropModalData(null)
	}

	async function handleUpdateProfile() {
		if (!myInfo) return

		setSubmitDisabled(true)

		let updatePayload: UserUpdatePayload = {}
		updatePayload.name = fullName

		if (croppedCoverBlob) {
			const coverImagePresignedUrl = await getPresignedUrl()
			const coverUrl = await uploadImage(coverImagePresignedUrl, croppedCoverBlob)
			updatePayload.cover_image = coverUrl
		}

		if (croppedDisplayBlob) {
			const displayImagePresignedUrl = await getPresignedUrl()
			const displayUrl = await uploadImage(displayImagePresignedUrl, croppedDisplayBlob)
			updatePayload.avatar = displayUrl
		}

		const editorContent = editorState.getCurrentContent()
		const isEditorEmpty = !editorContent.hasText()

		if (!isEditorEmpty) {
			updatePayload.description = draftToHtml(convertToRaw(editorContent))
		}

		try {
			await updateProfile(updatePayload)
			toast.success('Profile updated successfully!')
			queryClient.invalidateQueries('my_info')
			queryClient.invalidateQueries('popular_users')
			setTimeout(() => {
				router.push(`/user/${myInfo.username}`)
			})
		} catch (err) {
			toast.error('Something went wrong!')
		}

		setSubmitDisabled(false)
	}

	useEffect(() => {
		if (!myInfo) return
		const { name, description } = myInfo
		setFullName(name)
		if (description) {
			const contentBlock = htmlToDraft(description)
			if (contentBlock) {
				const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
				setEditorState(EditorState.createWithContent(contentState))
			}
		}
	}, [myInfo])

	if (isMyInfoLoading) {
		return <div>Loading...</div>
	}

	if (!myInfo) {
		return <div>No Profile Found</div>
	}

	return (
		<SEO title="Edit Profile">
			<Layout aside={<PopularGroups />}>
				<div className="mb-8">
					<h3 className="font-semibold text-slate-700 mb-5">Update Profile</h3>
					<label
						htmlFor="profile_cover_image"
						className="relative aspect-[8/2] rounded-lg bg-cover bg-center bg-sky-100 flex cursor-pointer overflow-hidden"
					>
						<div className="flex items-center gap-2 m-auto text-sky-600">
							<HiOutlinePhotograph fontSize={24} />
							<span className="text-base">Upload cover image</span>
						</div>
						<input
							type="file"
							accept="image/*"
							id="profile_cover_image"
							className="sr-only"
							onChange={(e) => handleSelectImage(e, 'COVER')}
						/>
						{(croppedCoverImg || myInfo.cover_image) && (
							<img
								src={croppedCoverImg || myInfo.cover_image}
								className="absolute w-full h-full object-cover"
							/>
						)}
					</label>
					<label
						htmlFor="profile_display_image"
						className="relative aspect-square flex w-24 bg-cover bg-center bg-sky-200 rounded-full -mt-14 ml-8 border border-2 border-white cursor-pointer overflow-hidden"
					>
						<HiOutlineCamera fontSize={24} className="m-auto text-sky-600" />
						<input
							type="file"
							accept="image/*"
							id="profile_display_image"
							className="sr-only"
							onChange={(e) => handleSelectImage(e, 'DISPLAY')}
						/>
						{(croppedDisplayImg || myInfo.avatar) && (
							<img
								src={croppedDisplayImg || myInfo.avatar || ''}
								className="absolute w-full h-full object-cover"
							/>
						)}
					</label>
					<div className="mt-4 flex gap-4 max-w-sm">
						<div className="flex-1">
							<label htmlFor="full_name" className="block text-sm font-medium text-slate-700">
								Full Name
							</label>
							<div className="mt-2">
								<input
									type="text"
									id="full_name"
									className="input"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
								/>
							</div>
						</div>
						{/*<div className="flex-1">
						<label htmlFor="user_name" className="block text-sm font-medium text-slate-700">
							Date of Birth
						</label>
						<div className="mt-2">
							<input
								type="text"
								id="user_name"
								className="input"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
							/>
						</div>
					</div>*/}
					</div>
					<div className="mt-4 w-full">
						<label htmlFor="group_description" className="block text-sm font-medium text-slate-700">
							Bio
						</label>
						<div className="mt-2 min-h-[4rem]">
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
					</div>
					<div className="mt-6">
						<button
							type="button"
							className="button"
							onClick={handleUpdateProfile}
							disabled={isUpdatingProfile || submitDisabled}
						>
							Update Profile
						</button>
					</div>
					{cropModalData ? (
						<Transition appear show={true} as={Fragment}>
							<Dialog as="div" className="relative z-10" onClose={() => setCropModalData(null)}>
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-200"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="fixed inset-0 bg-black bg-opacity-25" />
								</Transition.Child>

								<div className="fixed inset-0 overflow-y-auto">
									<div className="flex min-h-full items-center justify-center p-4 text-center">
										<Transition.Child
											as={Fragment}
											enter="ease-out duration-200"
											enterFrom="opacity-0 scale-95"
											enterTo="opacity-100 scale-100"
											leave="ease-in duration-200"
											leaveFrom="opacity-100 scale-100"
											leaveTo="opacity-0 scale-95"
										>
											<Dialog.Panel className="w-full max-w-xl transform rounded-lg bg-white p-5 text-left align-middle shadow-xl transition-all">
												<Dialog.Title
													as="h3"
													className="text-lg font-medium leading-6 text-gray-900"
												>
													Crop Image
												</Dialog.Title>
												<div className="mt-4">
													<ReactCrop
														crop={crop}
														aspect={cropModalData.type === 'COVER' ? 8 / 2 : 1 / 1}
														onChange={(c) => setCrop(c)}
													>
														<img src={imageSrc} alt="cropped image" ref={imgRef} />
													</ReactCrop>
												</div>
												<div className="mt-4 flex justify-end">
													<button type="button" className="button" onClick={handleImageCrop}>
														Crop
													</button>
													<button
														type="button"
														className="button-light ml-2"
														onClick={() => setCropModalData(null)}
													>
														Cancel
													</button>
												</div>
											</Dialog.Panel>
										</Transition.Child>
									</div>
								</div>
							</Dialog>
						</Transition>
					) : null}
				</div>
			</Layout>
		</SEO>
	)
}

export default EditProfile
