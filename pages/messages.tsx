import { GetServerSideProps } from 'next'
import ConversationThread from '../components/ConversationThread'
import ConversationList from '../components/ConversationList'
import Layout from '../components/shared/Layout'
import SEO from '../components/shared/SEO'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { detectMobile } from '../lib/utils/detectDevice'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context
    const authenticated = !!req.cookies?.jwt
    const isMobile = detectMobile(req)

    return {
        props: { isMobile, authenticated }
    }
}

interface MessagesProps {
    isMobile: boolean
    authenticated: boolean
}

function Messages({ isMobile, authenticated }: MessagesProps) {
    const [activeConversationId, setActiveConversationId] = useState<string>()
    const router = useRouter()

    useEffect(() => {
        if (!activeConversationId) return
        router.replace(`/messages?id=${activeConversationId}`)
    }, [activeConversationId])

    useEffect(() => {
        const { id } = router.query
        if (!id) return

        setActiveConversationId(String(id))
    }, [router.query])

    return (
        <SEO title="Messages">
            <Layout isMobile={isMobile}>
                <div className="flex" style={{ height: 'calc(100vh - 6rem)' }}>
                    <ConversationList
                        activeId={activeConversationId}
                        handleSetActiveId={(id) => setActiveConversationId(id)}
                    />
                    <ConversationThread authenticated={authenticated} activeId={activeConversationId} />
                </div>
            </Layout>
        </SEO>
    )
}

export default Messages
