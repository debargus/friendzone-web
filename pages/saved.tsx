import PopularGroups from '../components/PopularGroups'
import Layout from '../components/shared/Layout'

function Saved() {
    return (
        <Layout aside={<PopularGroups />}>
            <h1 className="mb-2">Saved</h1>
        </Layout>
    )
}

export default Saved
