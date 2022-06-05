import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { IoLogoGoogle } from 'react-icons/io5'
import SEO from '../../components/shared/SEO'
import { client } from '../../lib/client'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context

    if (req.cookies?.jwt) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

function Login() {
    const router = useRouter()
    const [formValues, setFormValues] = useState({
        username: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    function handleInputChange(e: any) {
        setFormValues((state) => ({ ...state, [e.target.name]: e.target.value }))
    }

    async function onSubmit(e: any) {
        e.preventDefault()
        setIsLoading(true)
        try {
            await client.post('/auth/login', formValues)
            toast.success('Login Successful!')
            router.push('/')
        } catch (err: any) {
            toast.error(`Error: ${err?.response?.data?.message}` ?? 'Something went wrong!')
            console.log(err)
        }
        setIsLoading(false)
    }

    return (
        <SEO title="Login">
            <div className="bg-sky-50 h-screen w-screen flex">
                <div className="drop-shadow-lg max-w-md w-full m-auto bg-white p-8 rounded-lg">
                    <div className="mb-6">
                        <h1 className="mb-1 text-xl font-semibold">Login</h1>
                        <p className="text-slate-400 text-sm">Enter your credentials to access your account</p>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="mt-3 max-w-md">
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Email"
                                    className="input"
                                    value={formValues.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="mt-3 mb-6 max-w-md">
                            <div className="flex items-center">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 flex-1">
                                    Password
                                </label>
                                <Link href="/forgot-password">
                                    <a className="link text-sm">forgot password?</a>
                                </Link>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    className="input"
                                    value={formValues.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <button className="button w-full" type="submit" disabled={isLoading}>
                            Login
                        </button>
                        <button className="mt-3 button-light w-full" disabled>
                            <IoLogoGoogle className="mr-2 text-slate-500" fontSize={20} />
                            <span>Login with Google</span>
                        </button>
                        <div className="mt-3">
                            <p className="text-sm text-slate-600">
                                Not a member?{' '}
                                <Link href="/auth/register">
                                    <a className="link ml-1">Register here</a>
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </SEO>
    )
}

export default Login
