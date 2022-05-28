import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import PopularGroups from '../PopularGroups'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'

interface LayoutProps {
    children: React.ReactNode
    rightSideComponent?: React.ReactNode
}

function Layout({ children, rightSideComponent }: LayoutProps) {
    const { data } = useMyInfo(true)

    return (
        <div className="bg-white w-screen min-h-screen">
            <Navbar user={data} />
            <div className="flex flex-row max-w-7xl mx-auto pt-6">
                <Sidebar />
                <div className="flex-1 px-4">{children}</div>
                {rightSideComponent ? rightSideComponent : <PopularGroups />}
            </div>
        </div>
    )
}

export default Layout
