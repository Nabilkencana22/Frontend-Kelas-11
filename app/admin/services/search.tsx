"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Search as SearchIcon } from "lucide-react"

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
        <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <SearchIcon size={18} />
            </div>
            <input
                type="text"
                name="search"
                id="search"
                className="w-full pl-11 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm shadow-slate-100/50"
                placeholder="Search data..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                autoComplete="off"
            />
        </div>
    )
}