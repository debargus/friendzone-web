import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import Layout from '../components/shared/Layout'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
    const noLayout = ['/auth/login', '/auth/register'].includes(appProps.router.pathname)

    return (
        <QueryClientProvider client={queryClient}>
            {noLayout ? (
                <Component {...pageProps} />
            ) : (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            )}
            <Toaster position="bottom-center" />
        </QueryClientProvider>
    )
}

export default MyApp
