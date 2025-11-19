import { openai } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { query } = await request.json()

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 })
        }

        // Generate embedding for the user query
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query,
        })

        const embedding = embeddingResponse.data[0].embedding

        // Search for jobs
        const { data: jobs, error: jobsError } = await supabase.rpc('match_jobs', {
            query_embedding: embedding,
            match_threshold: 0.3, // Adjust threshold as needed
            match_count: 5,
        })

        if (jobsError) {
            console.error('Error searching jobs:', jobsError)
            return NextResponse.json({ error: 'Error searching jobs' }, { status: 500 })
        }

        // Search for events
        const { data: events, error: eventsError } = await supabase.rpc('match_events', {
            query_embedding: embedding,
            match_threshold: 0.3, // Adjust threshold as needed
            match_count: 5,
        })

        if (eventsError) {
            console.error('Error searching events:', eventsError)
            return NextResponse.json({ error: 'Error searching events' }, { status: 500 })
        }

        return NextResponse.json({ jobs, events })
    } catch (error: any) {
        console.error('Search API error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 })
    }
}
