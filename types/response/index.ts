export type GroupResponse = {
	id: string
	name: string
	display_image: string
	cover_image: string
	members_count: number
	description?: string
}

export type UserResponse = {
	id: string
	username: string
	name: string
	avatar: null | string
}

export type UpvoteResponse = {
	id: string
	created_at: string
	updated_at: string
	post_id: string
	author_id: string
}

export type DownvoteResponse = {
	id: string
	created_at: string
	updated_at: string
	post_id: string
	author_id: string
}

export type PostResponse = {
	id: string
	created_at: string
	updated_at: string
	content: string
	author_id: string
	group_id: string
	upvotes_count: number
	downvotes_count: number
	upvoted_by_me: boolean
	downvoted_by_me: boolean
	bookmarked_by_me: boolean
	is_public: boolean
	author: UserResponse
	group: GroupResponse
	upvotes: UpvoteResponse[]
	downvotes: DownvoteResponse[]
}
