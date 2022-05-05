import { Fragment } from 'react'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import RightAside from '../RightAside'
import useMyInfo from '../../lib/hooks/user/useMyInfo'

interface LayoutProps {
    children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
    const { data } = useMyInfo(true)

    return (
        <Fragment>
            <div className="bg-white w-screen min-h-screen">
                <Navbar user={data} />
                <div className="flex flex-row max-w-7xl mx-auto pt-6">
                    <Sidebar />
                    <div className="flex-1 px-4 overflow-hidden">{children}</div>
                    <RightAside />
                </div>
            </div>
        </Fragment>
    )
}

export default Layout
