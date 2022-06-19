import Link from 'next/link'
import { HiFire, HiOutlineBookmark, HiOutlineChat, HiOutlineShare } from 'react-icons/hi'
import { ImArrowDown, ImArrowUp } from 'react-icons/im'

interface PollProps {}

function Poll({}: PollProps) {
    return (
        <div className="flex flex-row items-start w-full mb-8">
            <div className="flex flex-col items-center min-w-fit">
                <Link href="/user/1">
                    <a>
                        <img
                            className="inline-block h-9 w-9 rounded-full"
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                            alt=""
                        />
                    </a>
                </Link>
                <div className="flex flex-col text-slate-400 mt-4 gap-1">
                    <button className="flex text-sky-500">
                        <ImArrowUp fontSize={20} className="m-auto p-0.5" />
                    </button>
                    <span className="font-medium text-sky-500">468</span>
                    <button className="flex">
                        <ImArrowDown fontSize={20} className="m-auto p-0.5" />
                    </button>
                </div>
                <div className="mt-2">
                    <button className="flex text-orange-500">
                        <HiFire fontSize={28} className="m-auto p-0.5" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col ml-3 w-full">
                <div className="flex flex-row items-center text-sm mb-1.5 gap-2">
                    <Link href="/user/1">
                        <a>
                            <strong>Jon Skinner</strong>
                            <span className="text-slate-400 font-medium ml-2">@jonskinner</span>
                        </a>
                    </Link>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-500">Sep 23</span>
                </div>
                <div className="w-full overflow-hidden">
                    <p className="mb-4">What is your favorite Text Editor/IDE ?</p>
                    <div className="flex flex-col gap-3">
                        <div className="h-8 flex flex-row items-center justify-between overflow-hidden relative">
                            <div className="rounded-md bg-slate-200 absolute h-full" style={{ width: '25%' }} />
                            <div className="relative pl-3">
                                <strong className="font-medium text-slate-600">Visual Studio Code (Microsoft)</strong>
                            </div>
                            <span className="text-slate-600">25%</span>
                        </div>
                        <div className="h-8 flex flex-row items-center justify-between overflow-hidden relative">
                            <div className="rounded-md bg-slate-200 absolute h-full" style={{ width: '10%' }} />
                            <div className="relative pl-3">
                                <strong className="font-medium text-slate-600">Atom (Github)</strong>
                            </div>
                            <span className="text-slate-600">10%</span>
                        </div>
                        <div className="h-8 flex flex-row items-center justify-between overflow-hidden relative">
                            <div className="rounded-md bg-sky-300 absolute h-full" style={{ width: '65%' }} />
                            <div className="relative pl-3">
                                <strong className="font-semibold">Sublime Text (Jon Skinner)</strong>
                            </div>
                            <span className="text-slate-700 font-semibold">65%</span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center mt-3 text-sm">
                        <span className="text-slate-500">834 responses</span>
                        <span></span>
                    </div>
                </div>
                <div className="mt-5 flex items-center gap-1">
                    <button className="button-icon h-8">
                        <HiOutlineChat fontSize={20} className="-ml-1" />{' '}
                        <span className="ml-2 text-sm font-medium">65</span>
                    </button>
                    <button className="button-icon h-8">
                        <HiOutlineBookmark fontSize={20} />
                    </button>
                    <button className="button-icon h-8">
                        <HiOutlineShare fontSize={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Poll
