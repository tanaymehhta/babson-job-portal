'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
    onSearch: (query: string) => void
    isLoading: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md"
                    placeholder="Describe the job or event you're looking for..."
                    disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {isLoading && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                    )}
                </div>
            </div>
        </form>
    )
}
