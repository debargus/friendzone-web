import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SIDEBAR_LINK } from '../lib/constants/navigation'

interface SidebarProps {
    isMobile: boolean
}

function Sidebar({ isMobile }: SidebarProps) {
    const router = useRouter()

    return (
        <div
            className={classNames(
                isMobile &&
                    'fixed bottom-0 left-0 w-screen h-16 justify-around items-center border-t border-slate-200 bg-white',
                'flex md:flex-col md:w-60 px-4'
            )}
        >
            {SIDEBAR_LINK.map((item) => {
                return (
                    <Link href={item.link} key={item.key}>
                        <a
                            className={classNames(
                                item.matchingPaths.includes(router.pathname) && 'bg-slate-100 text-sky-500',
                                'flex items-center py-3 px-6 md:py-2 md:px-4 text-sm leading-5 rounded-md font-semibold text-slate-600 hover:bg-slate-100 active:bg-slate-200'
                            )}
                        >
                            <span>{item.icon}</span>
                            {!isMobile && <span className="ml-3">{item.label}</span>}
                        </a>
                    </Link>
                )
            })}
        </div>
    )
}

export default Sidebar
