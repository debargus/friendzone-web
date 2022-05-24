import Head from 'next/head'
import { Fragment } from 'react'

interface SEOProps {
    children: React.ReactNode
    title?: string
    description?: string
    image?: string
}

function SEO({ children, title, description, image }: SEOProps) {
    return (
        <Fragment>
            <Head>
                <title>{title ?? 'Friendzone'}</title>
                <meta name="description" content={description} />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:image" content={image} />
                <meta property="og:description" content={description} />
                <meta property="og:title" content={title} />
            </Head>
            {children}
        </Fragment>
    )
}

export default SEO
