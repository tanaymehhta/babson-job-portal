export type LocationType = 'Virtual' | 'Hybrid' | 'Onsite'
export type EventLocationType = 'Onsite' | 'Virtual' | 'Both'
export type Industry = 'Consulting' | 'Technology' | 'CPG' | 'Product Management' | 'Healthcare' | 'Venture Capital / Private Equity' | 'Real Estate'
export type EventType = 'Networking Event' | 'Employer-Sponsored' | 'Workshop'

export interface Job {
    id: string
    title: string
    date_posted: string
    company_name: string
    location_type: LocationType
    location_specifics?: string | null
    is_paid: boolean
    babson_connection?: string | null
    link: string
    requirements: string[]
    salary_min?: number | null
    salary_max?: number | null
    similarity?: number
}

export interface Event {
    id: string
    title: string
    date: string
    link: string
    description: string
    location_type: EventLocationType
    location_specifics?: string | null
    industry: Industry
    event_type: EventType
    similarity?: number
}

export interface SearchResult {
    jobs: Job[]
    events: Event[]
}
