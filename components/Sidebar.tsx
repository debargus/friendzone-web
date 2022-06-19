import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SIDEBAR_LINK } from '../lib/constants/navigation'

interface SidebarProps {}

function Sidebar({}: SidebarProps) {
    const router = useRouter()

    return (
        <div className="flex flex-col w-60 px-4">
            {SIDEBAR_LINK.map((item) => {
                return (
                    <Link href={item.link} key={item.key}>
                        <a
                            className={classNames(
                                item.matchingPaths.includes(router.pathname) && 'bg-slate-100 text-sky-500',
                                'flex items-center py-2 px-4 text-sm leading-5 rounded-md font-semibold text-slate-600 hover:bg-slate-100 active:bg-slate-200'
                            )}
                        >
                            <span>{item.icon}</span>
                            <span className="ml-3">{item.label}</span>
                        </a>
                    </Link>
                )
            })}
        </div>
    )
}

export default Sidebar
