import { Dialog, Transition } from '@headlessui/react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlinePencilAlt, HiOutlineShare } from 'react-icons/hi'
import { useQueryClient } from 'react-query'
import Post from '../../components/Post'
import SEO from '../../components/shared/SEO'
import { client } from '../../lib/client'
import useApproveRequest from '../../lib/client/hooks/group/useApproveRequest'
import useDeclineRequest from '../../lib/client/hooks/group/useDeclineRequest'
import useGroupPosts from '../../lib/client/hooks/group/useGroupPosts'
import useGroupRequests from '../../lib/client/hooks/group/useGroupRequests'
import useJoinRequest from '../../lib/client/hooks/group/useJoinRequest'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'
import useUserGroups from '../../lib/client/hooks/user/useUserGroups'
import { GroupResponse } from '../../types/response'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params, req } = context
    const authenticated = !!req.cookies?.jwt

    const response = await client.get('/group/' + params?.id)

    if (!response.data) {
        return {
            notFound: true
        }
    }

    return {
        props: { group: response.data?.data.group, authenticated }
    }
}

interface GroupDetailsProps {
    group: GroupResponse
    authenticated: boolean
}

function GroupDetails({ group, authenticated }: GroupDetailsProps) {
    const [requestModal, setRequestModal] = useState(false)
    const [totalMembers, setTotalMembers] = useState<number>(0)

    const { id, name, display_image, cover_image, description, members, members_count, admins } = group

    const { data, isLoading } = useGroupPosts(id, authenticated)
    const { data: myInfo } = useMyInfo(authenticated)
    const { mutateAsync: sendJoinRequest, isLoading: isSendingRequest, reset: resetJoinRequest } = useJoinRequest()
    const { data: groupsData } = useUserGroups(myInfo?.id)
    const { data: joinRequests } = useGroupRequests(id, isGroupAdmin())
    const { mutateAsync: approveRequest } = useApproveRequest()
    const { mutateAsync: declineRequest } = useDeclineRequest()
    const queryClient = useQueryClient()

    function isGroupJoined() {
        const filtered = members?.filter((member) => member.id === myInfo?.id)
        if (filtered?.length) return true
        else return false
    }

    function isRequestSent() {
        const filtered = groupsData?.requests?.filter((group) => group.id === id)
        if (filtered?.length) return true
        else return false
    }

    function isGroupAdmin() {
        if (!myInfo?.id) return false
        return !!admins?.filter((admin) => admin.id === myInfo.id).length
    }

    async function handleSendJoinRequest() {
        await sendJoinRequest(id)
        queryClient.invalidateQueries(['user_groups', myInfo?.id])
        toast.success('Join request sent!')
    }

    async function handleAcceptJoinRequest(userId: string) {
        const payload = {
            group_id: id,
            request_user_id: userId
        }
        await approveRequest(payload)
        toast.success('Request approved!')
        queryClient.invalidateQueries(['group_requests', id])
        queryClient.invalidateQueries('popular_groups')
        setTotalMembers((count) => count + 1)
    }

    async function handleDeclineJoinRequest(userId: string) {
        const payload = {
            group_id: id,
            request_user_id: userId
        }
        await declineRequest(payload)
        toast.success('Request declined!')
        queryClient.invalidateQueries(['group_requests', id])
    }

    useEffect(() => {
        if (joinRequests?.length === 0) {
            setRequestModal(false)
        }
        return () => {
            resetJoinRequest()
        }
    }, [joinRequests])

    useEffect(() => {
        setTotalMembers(members_count)
    }, [members_count])

    return (
        <SEO title={name} description={description} image={display_image}>
            <div
                className="aspect-[6/2] rounded-lg bg-cover bg-center bg-sky-100"
                style={{ backgroundImage: `url("${cover_image}")` }}
            >
                <span className="sr-only">{name}</span>
            </div>
            <div
                className="aspect-square w-20 bg-cover bg-center bg-sky-200 rounded-lg -mt-12 ml-8 border border-2 border-white"
                style={{
                    backgroundImage: `url("${display_image}")`
                }}
            />
            <div className="mt-2 flex items-bottom justify-between">
                <div className="ml-4">
                    <h1 className="text-slate-700 font-bold text-2xl">{name}</h1>
                    <strong className="font-medium text-slate-400 text-sm">{totalMembers} members</strong>
                </div>
                <div className="flex flex-row items-center -mt-2 gap-2">
                    {isGroupAdmin() ? (
                        <Fragment>
                            {joinRequests?.length ? (
                                <button
                                    className="button bg-orange-500 active:bg-orange-600"
                                    onClick={() => setRequestModal(true)}
                                >
                                    {joinRequests?.length} Join Requests
                                </button>
                            ) : null}
                            <button className="button-light">
                                <HiOutlinePencilAlt className="-ml-2" fontSize={20} />
                                <span className="ml-2">Edit Group</span>
                            </button>
                        </Fragment>
                    ) : isGroupJoined() ? (
                        <button className="button" disabled>
                            Joined
                        </button>
                    ) : isRequestSent() ? (
                        <button className="button" disabled>
                            Join request sent
                        </button>
                    ) : (
                        <button className="button" onClick={handleSendJoinRequest} disabled={isSendingRequest}>
                            Join Group
                        </button>
                    )}
                    <button className="button-light">
                        <HiOutlineShare className="-ml-2" fontSize={20} />
                        <span className="ml-2">Share</span>
                    </button>
                </div>
            </div>
            <div className="mt-4">
                <p>{description}</p>
            </div>
            <div className="mt-8">
                <h3 className="font-semibold text-slate-700">Recent Posts</h3>
                <div className="mt-5">
                    {isLoading ? <p>Loading...</p> : data?.map((post) => <Post key={post.id} data={post} />)}
                </div>
            </div>
            <Transition appear show={requestModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setRequestModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform rounded-lg bg-white p-5 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Join Requests
                                    </Dialog.Title>
                                    <div className="mt-6 flex flex-col gap-4">
                                        {joinRequests?.map((user) => (
                                            <div className="flex items-center justify-between" key={user.id}>
                                                <Link key={user.id} href={`/user/${user.username}`}>
                                                    <a className="text-sm flex items-center gap-3">
                                                        <div
                                                            className="h-9 w-9 bg-cover bg-center bg-sky-200 rounded-full text-sm"
                                                            style={{ backgroundImage: `url("${user.avatar}")` }}
                                                        />
                                                        <div className="flex flex-col">
                                                            <strong>{user.name}</strong>
                                                            <span className="text-slate-400 font-medium">
                                                                @{user.username}
                                                            </span>
                                                        </div>
                                                    </a>
                                                </Link>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="button"
                                                        onClick={() => handleAcceptJoinRequest(user.id)}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="button-light"
                                                        onClick={() => handleDeclineJoinRequest(user.id)}
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </SEO>
    )
}

export default GroupDetails
