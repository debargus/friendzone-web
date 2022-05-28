import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { FcAbout } from 'react-icons/fc'
import { FiSearch } from 'react-icons/fi'
import {
    HiOutlineBell,
    HiOutlineDocumentText,
    HiOutlineInbox,
    HiOutlinePlus,
    HiOutlineQuestionMarkCircle,
    HiOutlineUserGroup
} from 'react-icons/hi'
import { client } from '../lib/client'
import { UserResponse } from '../types/response'

interface NavbarProps {
    user?: UserResponse
}

function Navbar({ user }: NavbarProps) {
    const router = useRouter()

    async function handleLogout() {
        const { data } = await client.post('/auth/logout')
        if (data?.status === 200) {
            location.replace('/auth/login')
        }
    }

    return (
        <div className="border-b border-slate-200 bg-white">
            <div className="h-16 flex items-center justify-between max-w-7xl px-4 mx-auto">
                <div className="flex items-center">
                    <Link href="/">
                        <a className="flex flex-row items-center">
                            <FcAbout fontSize={32} style={{ opacity: 0.9 }} />
                            <span className="text-sky-500 font-bold text-lg ml-2">Friendzone</span>
                        </a>
                    </Link>
                    <div className="relative ml-8">
                        <FiSearch fontSize={20} className="text-slate-400 absolute top-1/2 left-2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="text-sm focus:outline-none active:outline-none bg-slate-100 border border-slate-200 focus:border-transparent focus:border-transparent focus:bg-transparent ring-0 focus:ring-2 ring-sky-500 w-[24rem] h-9 px-9 rounded-md"
                        />
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 border border-slate-300 text-slate-300 font-bold rounded-md w-6 h-6 flex cursor-default">
                            <span className="m-auto text-xs font-bold">/</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="button mr-4">
                            <HiOutlinePlus fontSize={18} className="-ml-1" /> <span className="ml-2">Create</span>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                                <div className="p-1">
                                    <Menu.Item>
                                        <div
                                            onMouseUp={() => router.push('/post/create')}
                                            className="hover:bg-slate-100 active:bg-slate-200 cursor-pointer flex w-full items-start rounded-md px-2 py-2 text-sm"
                                        >
                                            <span className="mt-1 mr-3">
                                                <HiOutlineDocumentText fontSize={24} className="text-slate-500" />
                                            </span>
                                            <div>
                                                <h3 className="font-semibold">Create a Post</h3>
                                                <p className="text-slate-500 text-sm p-0">
                                                    You can create a post in a group
                                                </p>
                                            </div>
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div
                                            className="hover:bg-slate-100 active:bg-slate-200 cursor-pointer flex w-full items-start rounded-md  px-2 py-2 text-sm"
                                            onMouseUp={() => router.push('/group/create')}
                                        >
                                            <span className="mt-1 mr-3">
                                                <HiOutlineUserGroup fontSize={24} className="text-slate-500" />
                                            </span>
                                            <div>
                                                <h3 className="font-semibold">Create a Group</h3>
                                                <p className="text-slate-500 text-sm p-0">
                                                    Create a group to add members
                                                </p>
                                            </div>
                                        </div>
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <Link href="/chat">
                        <a className="button-icon">
                            <HiOutlineInbox fontSize={22} />
                        </a>
                    </Link>
                    <button className="button-icon relative">
                        <HiOutlineBell fontSize={22} />
                        <span className="absolute bg-rose-500 text-white text-xs font-medium rounded rounded-md px-1 bottom-5 left-5">
                            12
                        </span>
                    </button>
                    <button className="button-icon">
                        <HiOutlineQuestionMarkCircle fontSize={22} />
                    </button>
                    <Menu as="div" className="ml-3 relative">
                        <div>
                            <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500">
                                <span className="sr-only">Open user menu</span>
                                <div
                                    className="h-8 w-8 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
                                    style={{ backgroundImage: user?.avatar ? `url("${user.avatar}")` : undefined }}
                                >
                                    {user?.name && <span className="sr-only">{user.name}</span>}
                                </div>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {user ? (
                                    <>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    onClick={() => router.push(`/user/${user?.username}`)}
                                                    className={classNames(
                                                        active && 'bg-gray-100',
                                                        'active:bg-gray-200 rounded-md px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer focus:bg-gray-200'
                                                    )}
                                                >
                                                    Your Profile
                                                </div>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    onClick={() => router.push('/profile/settings')}
                                                    className={classNames(
                                                        active && 'bg-gray-100',
                                                        'active:bg-gray-200 rounded-md px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer focus:bg-gray-200'
                                                    )}
                                                >
                                                    Settings
                                                </div>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    onClick={handleLogout}
                                                    className={classNames(
                                                        active && 'bg-gray-100',
                                                        'active:bg-gray-200 rounded-md px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer focus:bg-gray-200'
                                                    )}
                                                >
                                                    Sign out
                                                </div>
                                            )}
                                        </Menu.Item>
                                    </>
                                ) : (
                                    <Menu.Item>
                                        <div
                                            onClick={() => router.push('/auth/login')}
                                            className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                                        >
                                            Sign in
                                        </div>
                                    </Menu.Item>
                                )}
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default Navbar
