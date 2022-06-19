import PopularGroups from '../components/PopularGroups'
import EmptyComponent from '../components/shared/EmptyComponent'
import Layout from '../components/shared/Layout'

function Saved() {
    return (
        <Layout aside={<PopularGroups />}>
            <EmptyComponent title="Coming Soon!" description="This page is under development." />
        </Layout>
    )
}

export default Saved
