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

function Register() {
    const router = useRouter()
    const [formValues, setFormValues] = useState({
        email: '',
        name: '',
        username: '',
        password: ''
    })

    function handleInputChange(e: any) {
        setFormValues((state) => ({ ...state, [e.target.name]: e.target.value }))
    }

    async function onSubmit(e: any) {
        e.preventDefault()

        try {
            const response = await client.post('/auth/register', formValues)
            const { data } = response
            const { message } = data
            toast.success(message)
            router.push('/')
        } catch (err) {
            console.log(err)
            // toast.success(message)
        }
    }

    return (
        <SEO title="Register">
            <div className="bg-sky-50 h-screen w-screen flex">
                <div className="drop-shadow-lg max-w-md w-full m-auto bg-white p-8 rounded-lg">
                    <div className="mb-6">
                        <h1 className="mb-1 text-xl font-semibold">Register</h1>
                        <p className="text-slate-400 text-sm">Create an account and have fun!</p>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="mt-3 max-w-md">
                            <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 flex-1">
                                Full Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="full_name"
                                    name="name"
                                    placeholder="Full Name"
                                    className="input"
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="mt-3 max-w-md">
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 flex-1">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="User Name"
                                    className="input"
                                    value={formValues.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="mt-3 max-w-md">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    className="input"
                                    value={formValues.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="mt-3 mb-6 max-w-md">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 flex-1">
                                Password
                            </label>
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
                        <button className="button w-full" type="submit">
                            Register
                        </button>
                        <button className="mt-3 button-light w-full">
                            <IoLogoGoogle className="mr-2 text-slate-500" fontSize={20} />
                            <span>Register with Google</span>
                        </button>
                        <div className="mt-3">
                            <p className="text-sm text-slate-600">
                                Already joined?{' '}
                                <Link href="/auth/login">
                                    <a className="link ml-1">Login here</a>
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </SEO>
    )
}

export default Register
