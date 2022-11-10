import { GetServerSideProps } from 'next'
import PopularGroups from '../components/PopularGroups'
import EmptyComponent from '../components/shared/EmptyComponent'
import Layout from '../components/shared/Layout'
import { detectMobile } from '../lib/utils/detectDevice'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context
    const isMobile = detectMobile(req)

    return {
        props: { isMobile }
    }
}

interface MentionsProps {
    isMobile: boolean
}

function Mentions({ isMobile }: MentionsProps) {
    return (
        <Layout aside={<PopularGroups />} isMobile={isMobile}>
            <div>
                <EmptyComponent title="Coming Soon!" description="This page is under development." />
            </div>
        </Layout>
    )
}

export default Mentions
