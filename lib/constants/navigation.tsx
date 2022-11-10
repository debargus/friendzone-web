import { HiOutlineAnnotation, HiOutlineBookmark, HiOutlineHome, HiTrendingUp } from 'react-icons/hi'

export const SIDEBAR_LINK = [
    {
        key: 'home',
        label: 'Home',
        link: '/',
        matchingPaths: ['/', '/post/[id]'],
        icon: <HiOutlineHome fontSize={22} />
    },
    {
        key: 'trending',
        label: 'Trending',
        link: '/trending',
        matchingPaths: ['/trending', '/trending/groups'],
        icon: <HiTrendingUp fontSize={22} />
    },
    {
        key: 'messages',
        label: 'Messages',
        link: '/messages',
        matchingPaths: ['/messages'],
        icon: <HiOutlineAnnotation fontSize={22} />
    },
    // {
    //     key: 'mentions',
    //     label: 'Mentions',
    //     link: '/mentions',
    //     matchingPaths: ['/mentions'],
    //     icon: <HiOutlineAtSymbol fontSize={22} />
    // },
    {
        key: 'saved',
        label: 'Saved',
        link: '/saved',
        matchingPaths: ['/saved'],
        icon: <HiOutlineBookmark fontSize={22} />
    }
]
