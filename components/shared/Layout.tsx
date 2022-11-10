import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'

interface LayoutProps {
    children: React.ReactNode
    aside?: React.ReactNode
    isMobile: boolean
}

function Layout({ children, aside, isMobile }: LayoutProps) {
    const { data } = useMyInfo(true)

    return (
        <div className="bg-white w-screen min-h-screen">
            <Navbar user={data} isMobile={isMobile} />
            <div className="flex flex-row max-w-7xl mx-auto pt-4 md:pt-6">
                <Sidebar isMobile={isMobile} />
                <div className="flex-1 px-4 pb-16 md:pb-0">{children}</div>
                {!isMobile && aside && <div className="flex flex-col w-72 px-4">{aside}</div>}
            </div>
        </div>
    )
}

export default Layout
