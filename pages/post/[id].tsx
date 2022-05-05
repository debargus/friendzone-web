import { formatDistanceToNow } from 'date-fns'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { HiFire, HiOutlineBookmark, HiOutlineChat, HiOutlineLockClosed, HiOutlineShare } from 'react-icons/hi'
import { ImArrowDown, ImArrowUp } from 'react-icons/im'
import sanitizeHtml from 'sanitize-html'
import SEO from '../../components/shared/SEO'
import useDownVote from '../../lib/client/hooks/post/useDownvote'
import usePost, { fetchPost } from '../../lib/client/hooks/post/usePost'
import useUpvote from '../../lib/client/hooks/post/useUpvote'
import useMyInfo from '../../lib/client/hooks/user/useMyInfo'
import { PostResponse } from '../../types/response'

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { params, req } = context
	const authenticated = !!req.cookies?.jwt

	const post = await fetchPost(String(params?.id))

	if (!post) {
		return {
			notFound: true
		}
	}

	return {
		props: { post, authenticated }
	}
}

interface PostDetailsProps {
	post: PostResponse
	authenticated: boolean
}

function PostDetails({ post, authenticated }: PostDetailsProps) {
	const { data: postData } = usePost(post.id, post)
	const { data: myInfo } = useMyInfo(authenticated)
	const { mutate: upvotePost, isLoading: isUpvotingPost } = useUpvote()
	const { mutate: downvotePost, isLoading: isDownvotingPost } = useDownVote()

	if (!postData) {
		return <p>Loading...</p>
	}

	const { id, author, content, upvotes_count, downvotes_count, created_at, group, is_public } = postData
	const totalVoteCount = upvotes_count === 0 && downvotes_count === 0 ? 0 : upvotes_count - downvotes_count

	return (
		<SEO title={`Posted by @${author.username}`}>
			<div className="flex flex-row items-start w-full mb-8">
				<div className="flex flex-col items-center min-w-fit">
					<Link href={`/user/${author.username}`}>
						<a>
							<div
								className="h-10 w-10 bg-cover bg-center bg-sky-200 rounded-full"
								style={{ backgroundImage: `url("${author.avatar}")` }}
							/>
						</a>
					</Link>
					<div className="flex flex-col items-center text-slate-400 mt-4 gap-1">
						<button className="flex" disabled={isUpvotingPost} onClick={() => upvotePost(id)}>
							<ImArrowUp fontSize={20} className="m-auto p-0.5" />
						</button>
						<span className="font-medium">{totalVoteCount}</span>
						<button className="flex" disabled={isDownvotingPost} onClick={() => downvotePost(id)}>
							<ImArrowDown fontSize={20} className="m-auto p-0.5" />
						</button>
					</div>
					<div className="mt-2">
						<button className="flex text-slate-300">
							<HiFire fontSize={28} className="m-auto p-0.5" />
						</button>
					</div>
				</div>
				<div className="flex flex-col ml-3">
					<div className="flex flex-row items-center text-sm mb-1.5 gap-2">
						<Link href={`/user/${author.username}`}>
							<a>
								<strong>{author.name}</strong>
								<span className="text-slate-400 font-medium ml-2">@{author.username}</span>
							</a>
						</Link>
						<span className="text-slate-400">&bull;</span>
						<span className="text-slate-500">
							{formatDistanceToNow(new Date(created_at), { addSuffix: true })}
						</span>
					</div>
					<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
					<div className="mt-2 text-sm text-slate-400">
						Posted in{' '}
						<Link href={`/group/${group.id}`}>
							<a className="link mr-2">{group.name}</a>
						</Link>
						{!is_public && (
							<div
								title="Visible to only group members"
								className="cursor-default text-xs text-white bg-slate-400 rounded-md px-1.5 py-0.5 inline-flex items-center"
							>
								<HiOutlineLockClosed fontSize={12} />
								<span className="pl-1">Only group</span>
							</div>
						)}
					</div>
					<div className="mt-2 flex items-center gap-1">
						<button className="button-icon h-8">
							<HiOutlineChat fontSize={20} className="-ml-1" />{' '}
							<span className="ml-2 text-sm font-medium">3</span>
						</button>
						<button className="button-icon h-8">
							<HiOutlineBookmark fontSize={20} />
						</button>
						<button className="button-icon h-8">
							<HiOutlineShare fontSize={20} />
						</button>
					</div>
					<h3 className="font-semibold text-sm text-slate-700 mt-4">Comments</h3>
					<div className="flex gap-4 mt-3">
						<Link href={`/profile`}>
							<a>
								<div
									className="h-8 w-8 min-w-8 bg-sky-400 bg-cover bg-center rounded-full"
									style={{ backgroundImage: `url("${myInfo?.avatar}")` }}
								/>
							</a>
						</Link>
						<textarea className="input resize-none h-16" placeholder="Type your comment" />
						<div>
							<button className="button">Comment</button>
						</div>
					</div>
				</div>
			</div>
		</SEO>
	)
}

export default PostDetails
