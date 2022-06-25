import Link from 'next/link'
import { GroupResponse } from '../types/response'

interface GroupViewType {
    group: GroupResponse
}

function GroupMiniView({ group }: GroupViewType) {
    const { id, name, cover_image, display_image, members_count } = group

    return (
        <div className="w-full">
            <div
                className="aspect-[6/2] rounded-t-md w-full bg-cover bg-sky-100 bg-center"
                style={{ backgroundImage: `url('${cover_image}')` }}
            />
            <div className="flex justify-center">
                <Link href={`/group/${id}`}>
                    <a
                        className="aspect-square w-20 -mt-12 bg-cover bg-center bg-sky-200 rounded-md border border-2 border-white"
                        style={{ backgroundImage: `url('${display_image}')` }}
                    />
                </Link>
            </div>
            <div className="flex flex-row items-center mt-2">
                <div className="flex-1">
                    <Link href={`/group/${id}`}>
                        <a>
                            <h3 className="text-slate-700 font-semibold text-lg">{name}</h3>
                        </a>
                    </Link>
                    <span className="text-sm text-slate-400">{members_count} members</span>
                </div>
                <Link href={`/group/${id}`}>
                    <button className="button">
                        <span>View Group</span>
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default GroupMiniView
