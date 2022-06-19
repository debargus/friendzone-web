import '../styles/globals.css'
import '../styles/react-crop.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <Toaster position="bottom-center" />
        </QueryClientProvider>
    )
}

export default MyApp
