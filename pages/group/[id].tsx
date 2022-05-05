import { GetServerSideProps } from 'next'
import { HiOutlineShare } from 'react-icons/hi'
import Post from '../../components/Post'
import SEO from '../../components/shared/SEO'
import { client } from '../../lib/client'
import useAllPosts from '../../lib/client/hooks/group/useAllPosts'
import usePublicPosts from '../../lib/client/hooks/group/usePublicPosts'
import { GroupResponse } from '../../types/response'

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { params, req } = context
	const authenticated = !!req.cookies?.jwt

	const { data } = await client.get('/group/' + params?.id)

	return {
		props: { group: data?.data.group, authenticated }
	}
}

interface GroupDetailsProps {
	group: GroupResponse
	authenticated: boolean
}

function GroupDetails({ group, authenticated }: GroupDetailsProps) {
	const { id, name, display_image, cover_image, members_count, description } = group
	const { data, isLoading } = authenticated ? useAllPosts(id) : usePublicPosts(id)

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
					<strong className="font-medium text-slate-400 text-sm">{members_count} members</strong>
				</div>
				<div className="flex flex-row items-center -mt-2 gap-2">
					<button className="button">Join Group</button>
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
		</SEO>
	)
}

export default GroupDetails
