"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
    search: string
}

export default function Search(props: Props) {
    const [keyword, setKeyword] = useState<string>(props.search)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())

            if (keyword === "") {
                params.delete("search")
            } else {
                params.set("search", keyword)
            }

            router.replace(`?${params.toString()}`, { scroll: false })
        }, 500) // delay 500ms

        return () => clearTimeout(delayDebounce)
    }, [keyword])

    return (
        <div className="w-full p-3">
            <input
                type="text"
                name="search"
                id="search"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pencarian..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    )
}