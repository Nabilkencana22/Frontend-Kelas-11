"use client"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

type Props = {
    search: string
}

// Element name = search have a property
// "search" with string type
export default function Search(props: Props) {
    const [keyword, setKeyword] =
        useState<string>(props.search)
    const router = useRouter();

    function handleSearch(e: KeyboardEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.key === `Enter`) {
            // if user press Enter key
            const params = new URLSearchParams(window.location.search);
            // get current URL search params
            if (keyword === ``) {
                params.delete(`search`);
                // delete search from URL
            } else {
                params.set(`search`, keyword);
                // set add search to URL
            }
            router.push(`?${params.toString()}`);
        }
    }

    return (
        <div className="w-full p-3">
            <input
                type="text"
                name="search"
                id="search"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pencarian Service..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyUp={handleSearch}
            />
        </div>
    )
}