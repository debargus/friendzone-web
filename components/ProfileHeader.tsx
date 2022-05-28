import React, { Fragment } from 'react'
import { UserResponse } from '../types/response'
import sanitizeHtml from 'sanitize-html'
import { HiOutlineMail, HiOutlinePencilAlt, HiOutlineUserAdd } from 'react-icons/hi'
import Link from 'next/link'
import useFollowUser from '../lib/client/hooks/user/useFollowUser'
import useUnfollowUser from '../lib/client/hooks/user/useUnfollowUser'

function ProfileHeader({ profileData, isMyProfile }: { profileData: UserResponse; isMyProfile?: boolean }) {
	const { id, name, username, avatar, description, cover_image, followers_count, following_count } = profileData

	const { mutateAsync: followUser, isLoading: isFollowUserLoading } = useFollowUser()
	const { mutateAsync: unfollowUser, isLoading: isUnfollowUserLoading } = useUnfollowUser()

	async function handleToggleFollow() {
		const flag = false
		followUser(id)
		if (flag) unfollowUser(id)
	}

	return (
		<Fragment>
			<div
				className="aspect-[8/2] rounded-lg bg-cover bg-center bg-sky-100"
				style={{ backgroundImage: `url("${cover_image}")` }}
			>
				<span className="sr-only">{name}</span>
			</div>
			<div
				className="aspect-square w-24 bg-cover bg-center bg-sky-200 rounded-full -mt-14 ml-8 border border-2 border-white"
				style={{
					backgroundImage: `url("${avatar}")`
				}}
			/>
			<div className="mt-2 ml-3">
				<div className="flex-1 flex items-start justify-between">
					<div>
						<h2 className="text-lg text-slate-700 font-bold ">{name}</h2>
						<span className="text-slate-400 font-medium">@{username}</span>
					</div>
					<div className="ml-3">
						{isMyProfile ? (
							<Link href="/profile/edit">
								<a className="button-light">
									<HiOutlinePencilAlt className="-ml-2" fontSize={20} />
									<span className="ml-2">Edit Profile</span>
								</a>
							</Link>
						) : (
							<div className="flex items-center gap-2">
								<button className="button-light px-2.5">
									<HiOutlineMail fontSize={20} />
								</button>
								<button
									className="button"
									disabled={isFollowUserLoading || isUnfollowUserLoading}
									onClick={handleToggleFollow}
								>
									<HiOutlineUserAdd className="-ml-2" fontSize={20} />
									<span className="ml-2">Follow</span>
								</button>
							</div>
						)}
					</div>
				</div>
				{description && (
					<div className="mt-2" dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
				)}
				<div className="flex gap-4 mt-2 text-slate-500">
					<div>
						<span className="font-semibold text-slate-700">{followers_count}</span> Followers
					</div>
					<div>
						<span className="font-semibold text-slate-700">{following_count}</span> Following
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default ProfileHeader
