import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'

interface LayoutProps {
    children: React.ReactNode
    aside?: React.ReactNode
}

function Layout({ children, aside }: LayoutProps) {
    const { data } = useMyInfo(true)

    return (
        <div className="bg-white w-screen min-h-screen">
            <Navbar user={data} />
            <div className="flex flex-row max-w-7xl mx-auto pt-6">
                <Sidebar />
                <div className="flex-1 px-4">{children}</div>
                {aside && <div className="flex flex-col w-72 px-4">{aside}</div>}
            </div>
        </div>
    )
}

export default Layout
