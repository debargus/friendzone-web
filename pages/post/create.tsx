import { Listbox, Switch, Transition } from '@headlessui/react'
import classNames from 'classnames'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiCheck, HiOutlineSelector } from 'react-icons/hi'
import { EditorState, convertToRaw } from 'draft-js'
import dynamic from 'next/dynamic'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { useRouter } from 'next/router'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'
import useUserGroups from '../../lib/client/hooks/user/useUserGroups'
import useCreatePost, { PostCreatePayload } from '../../lib/client/hooks/post/useCreatePost'
import SEO from '../../components/shared/SEO'
import Layout from '../../components/shared/Layout'
import PopularGroups from '../../components/PopularGroups'
import InfoComponent from '../../components/shared/InfoComponent'

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(({ Editor }) => Editor) as any, {
    ssr: false
}) as typeof Editor

function CreatePost() {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
    const [isPublic, setIsPublic] = useState(true)
    const [isEditorFocused, setIsEditorFocused] = useState(false)
    const router = useRouter()

    const { data: myInfo } = useMyInfo(true)
    const { data: myGroups, isLoading: isMyGroupsLoading } = useUserGroups(myInfo?.id)
    const { mutateAsync: createPost, isLoading: isCreatingPost } = useCreatePost()

    const grabGroupNameById = useCallback(
        (id: string) => {
            const groupFiltered = myGroups?.groups?.filter((group) => group.id === id)
            if (groupFiltered?.length) {
                return groupFiltered[0].name
            } else {
                return ''
            }
        },
        [myGroups]
    )

    async function handleCreatePost() {
        const editorContent = editorState.getCurrentContent()
        const isEditorEmpty = !editorContent.hasText()

        if (isEditorEmpty) {
            toast.error('Please type something')
            return
        }

        if (!selectedGroupId) {
            toast.error('Please select a group')
            return
        }

        const payload: PostCreatePayload = {
            content: draftToHtml(convertToRaw(editorContent)),
            group_id: selectedGroupId,
            is_public: isPublic
        }

        try {
            const postData = await createPost(payload)
            toast.success('Post created successfully!')
            setTimeout(() => {
                router.push(`/post/${postData?.id}`)
            }, 200)
        } catch (err) {
            console.log(err)
            toast.error('Something went wrong! Try again')
        }
    }

    useEffect(() => {
        setEditorState(EditorState.moveFocusToEnd(editorState))
    }, [])

    useEffect(() => {
        const { groupId } = router.query
        if (!groupId || !myGroups?.groups.length) return
        const selectedGroup = !!myGroups.groups.find((group) => group.id === String(groupId))
        if (selectedGroup) setSelectedGroupId(String(groupId))
    }, [myGroups, router.query])

    return (
        <SEO title="Create a new post">
            <Layout aside={<PopularGroups />}>
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-700 mb-5">Create a new post</h3>
                    <div className="mt-4">
                        <div className="min-h-[7rem]">
                            <RichEditor
                                stripPastedStyles
                                toolbarHidden
                                onFocus={() => setIsEditorFocused(true)}
                                onBlur={() => setIsEditorFocused(false)}
                                editorClassName={`${
                                    isEditorFocused ? 'border-transparent ring-2 ring-sky-500 ' : ''
                                }input h-auto text-sm min-h-[7rem] py-2`}
                                editorState={editorState}
                                onEditorStateChange={(state) => setEditorState(state)}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-start justify-between">
                        <Listbox
                            value={selectedGroupId}
                            onChange={setSelectedGroupId}
                            disabled={myGroups?.groups.length === 0}
                        >
                            <div className="relative w-48">
                                <Listbox.Button className="relative w-full cursor-default border border-slate-100 rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
                                    <span className={classNames(!selectedGroupId && 'opacity-50', 'block truncate')}>
                                        {selectedGroupId ? grabGroupNameById(selectedGroupId) : 'Select a group'}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <HiOutlineSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute m-0 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                        {myGroups &&
                                            myGroups.groups?.map((group, groupIdx) => (
                                                <Listbox.Option
                                                    key={groupIdx}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 m-0 ${
                                                            active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={group.id}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${
                                                                    selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                            >
                                                                {group.name}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                                                                    <HiCheck className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                        <div className="flex items-center">
                            <Switch.Group>
                                <Switch
                                    checked={isPublic}
                                    onChange={setIsPublic}
                                    className={`${
                                        isPublic ? 'bg-sky-500' : 'bg-slate-300'
                                    } relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                    <span className="sr-only">Public Post</span>
                                    <span
                                        aria-hidden="true"
                                        className={`${
                                            isPublic ? 'translate-x-4' : 'translate-x-0'
                                        } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                </Switch>
                                <Switch.Label className="ml-2 cursor-pointer text-sm text-slate-600">
                                    Publicly visible
                                </Switch.Label>
                            </Switch.Group>
                        </div>
                    </div>
                    {!isMyGroupsLoading && myGroups?.groups.length === 0 ? (
                        <InfoComponent text="You have not joined any group. Please join any group to create a post!" />
                    ) : (
                        <div className="flex items-center mt-6">
                            <button
                                type="button"
                                className="button"
                                onClick={handleCreatePost}
                                disabled={isCreatingPost}
                            >
                                Create Post
                            </button>
                        </div>
                    )}
                </div>
            </Layout>
        </SEO>
    )
}

export default CreatePost
