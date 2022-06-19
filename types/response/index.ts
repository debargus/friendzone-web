export type GroupResponse = {
    id: string
    name: string
    display_image: string
    cover_image: string
    members_count: number
    admins?: UserResponse[]
    members?: UserResponse[]
    description?: string
}

export type GroupCreatePayload = {
    name: string
    display_image: string
    cover_image: string
    description: string
}

export type GroupUpdatePayload = {
    id: string
    name?: string
    display_image?: string
    cover_image?: string
    description?: string
}

export type UserUpdatePayload = {
    username?: string
    name?: string
    avatar?: string
    cover_image?: string
    description?: string
    dob?: string
}

export type UserResponse = {
    id: string
    username: string
    name: string
    avatar: null | string
    cover_image?: string
    description?: string
    dob?: string
    followers_count?: number
    following_count?: number
}

export type UpvoteResponse = {
    id: string
    created_at: string
    updated_at: string
}

export type DownvoteResponse = {
    id: string
    created_at: string
    updated_at: string
}

export type HotResponse = {
    id: string
    created_at: string
    updated_at: string
}

export type CommentResponse = {
    id: string
    created_at: string
    updated_at: string
    comment_text: string
    author: UserResponse
}

export type PostResponse = {
    id: string
    created_at: string
    updated_at: string
    content: string
    upvotes_count: number
    downvotes_count: number
    upvoted_by_me: boolean
    downvoted_by_me: boolean
    bookmarked_by_me: boolean
    is_public: boolean
    is_updated: boolean
    author: UserResponse
    group: GroupResponse
    comments: CommentResponse[]
    comments_count: number
    hots_count: number
    my_downvote: DownvoteResponse | null
    my_upvote: UpvoteResponse | null
    my_hot: HotResponse | null
}
