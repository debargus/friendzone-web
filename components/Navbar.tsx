import Link from 'next/link'
import { FcAbout } from 'react-icons/fc'
import { FiSearch } from 'react-icons/fi'
import { HiOutlineBell, HiOutlineInbox, HiOutlinePlus, HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import { UserResponse } from '../types/response'
import NavUserMenu from './NavUserMenu'

interface NavbarProps {
    user?: UserResponse
}

function Navbar({ user }: NavbarProps) {
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
                    <button className="button mr-4">
                        <HiOutlinePlus fontSize={18} className="-ml-1" /> <span className="ml-2">Create</span>
                    </button>
                    <button className="button-icon">
                        <HiOutlineInbox fontSize={22} />
                    </button>
                    <button className="button-icon relative">
                        <HiOutlineBell fontSize={22} />
                        <span className="absolute bg-rose-500 text-white text-xs font-medium rounded rounded-md px-1 bottom-5 left-5">
                            12
                        </span>
                    </button>
                    <button className="button-icon">
                        <HiOutlineQuestionMarkCircle fontSize={22} />
                    </button>
                    <div className="ml-2 relative group">
                        <div
                            className="h-9 w-9 rounded-full ring-0 ring-sky-400 bg-sky-400 group-hover:ring-2 cursor-pointer bg-cover bg-center"
                            style={{ backgroundImage: `url("${user?.avatar}")` }}
                        />
                        <div className="absolute right-0 top-full min-w-[15rem] hidden group-hover:block pt-2 -mt-2">
                            <NavUserMenu authenticated={!!user} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
