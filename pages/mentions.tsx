import PopularGroups from '../components/PopularGroups'
import EmptyComponent from '../components/shared/EmptyComponent'
import Layout from '../components/shared/Layout'

function Mentions() {
    return (
        <Layout aside={<PopularGroups />}>
            <div>
                <EmptyComponent title="Coming Soon!" description="This page is under development." />
            </div>
        </Layout>
    )
}

export default Mentions
