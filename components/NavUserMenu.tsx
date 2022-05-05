import Link from 'next/link'
import { HiOutlineCog, HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi'
import { client } from '../lib/client'

function NavUserMenu({ authenticated }: { authenticated: boolean }) {
	async function handleLogout() {
		const { data } = await client.post('/auth/logout')
		if (data?.status === 200) {
			location.reload()
		}
	}

	return (
		<div className="absolute right-0 top-full min-w-[12rem] hidden group-hover:block pt-2">
			<div className="bg-white py-2 pb-3 rounded-md drop-shadow-md border border-slate-100">
				{authenticated && (
					<div className="flex flex-col mb-3">
						<Link href="/profile">
							<a className="px-3 py-2 flex flex-row items-center font-medium text-sm text-slate-600 hover:bg-slate-100 active:bg-slate-200">
								<HiOutlineUserCircle fontSize={22} className="mr-2" />
								<span>My Profile</span>
							</a>
						</Link>
						<Link href="/profile/settings">
							<a className="px-3 py-2 flex flex-row items-center font-medium text-sm text-slate-600 hover:bg-slate-100 active:bg-slate-200">
								<HiOutlineCog fontSize={22} className="mr-2" />
								<span>Settings</span>
							</a>
						</Link>
					</div>
				)}
				<div className="px-2">
					{authenticated ? (
						<button className="button w-full bg-red-500 active:bg-red-600" onClick={handleLogout}>
							<HiOutlineLogout fontSize={22} />
							<span className="ml-2">Logout</span>
						</button>
					) : (
						<Link href="/auth/login">
							<a className="button w-full">Log in</a>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

export default NavUserMenu
