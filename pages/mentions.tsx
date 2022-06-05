import PopularGroups from '../components/PopularGroups'
import Layout from '../components/shared/Layout'

function Mentions() {
    return (
        <Layout aside={<PopularGroups />}>
            <h1 className="mb-2">Mentions</h1>
        </Layout>
    )
}

export default Mentions
