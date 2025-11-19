import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { Job, Event } from '../types'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const openaiKey = process.env.OPENAI_API_KEY!

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({ apiKey: openaiKey })

const sampleJobs = [
    {
        title: 'Investment Banking Analyst Intern',
        company_name: 'Goldman Sachs',
        location_type: 'Onsite',
        location_specifics: 'New York, NY',
        is_paid: true,
        babson_connection: 'Alumni Referral',
        link: 'https://www.goldmansachs.com/careers',
        requirements: ['Financial Modeling', 'Excel', 'Accounting'],
        salary_min: 85000,
        salary_max: 110000,
    },
    {
        title: 'Associate Product Manager',
        company_name: 'Spotify',
        location_type: 'Hybrid',
        location_specifics: 'Boston, MA',
        is_paid: true,
        link: 'https://www.lifeatspotify.com/',
        requirements: ['Agile', 'User Research', 'Data Analysis'],
        salary_min: 90000,
        salary_max: 130000,
    },
    {
        title: 'Marketing Coordinator',
        company_name: 'HubSpot',
        location_type: 'Hybrid',
        location_specifics: 'Cambridge, MA',
        is_paid: true,
        babson_connection: 'Previous Intern',
        link: 'https://www.hubspot.com/careers',
        requirements: ['SEO', 'Content Marketing', 'Social Media'],
        salary_min: 60000,
        salary_max: 80000,
    },
    {
        title: 'Business Analyst',
        company_name: 'McKinsey & Company',
        location_type: 'Onsite',
        location_specifics: 'Boston, MA',
        is_paid: true,
        link: 'https://www.mckinsey.com/careers',
        requirements: ['Problem Solving', 'Analytics', 'Presentation Skills'],
        salary_min: 100000,
        salary_max: 140000,
    },
    {
        title: 'Venture Capital Analyst Intern',
        company_name: 'Bessemer Venture Partners',
        location_type: 'Onsite',
        location_specifics: 'San Francisco, CA',
        is_paid: true,
        babson_connection: 'Partner is Alum',
        link: 'https://www.bvp.com/',
        requirements: ['Market Research', 'Financial Analysis', 'Networking'],
        salary_min: 4000,
        salary_max: 6000,
    },
    {
        title: 'Supply Chain Manager',
        company_name: 'Wayfair',
        location_type: 'Hybrid',
        location_specifics: 'Boston, MA',
        is_paid: true,
        link: 'https://www.wayfair.com/careers',
        requirements: ['Logistics', 'Operations Management', 'SQL'],
        salary_min: 75000,
        salary_max: 95000,
    },
    {
        title: 'Data Analyst',
        company_name: 'DraftKings',
        location_type: 'Onsite',
        location_specifics: 'Boston, MA',
        is_paid: true,
        link: 'https://careers.draftkings.com/',
        requirements: ['Python', 'SQL', 'Tableau'],
        salary_min: 80000,
        salary_max: 110000,
    },
    {
        title: 'Strategy Consultant',
        company_name: 'Deloitte',
        location_type: 'Hybrid',
        location_specifics: 'New York, NY',
        is_paid: true,
        link: 'https://www2.deloitte.com/us/en/careers/students.html',
        requirements: ['Strategic Planning', 'Research', 'Communication'],
        salary_min: 90000,
        salary_max: 115000,
    },
    {
        title: 'Social Media Manager',
        company_name: 'Gymshark',
        location_type: 'Virtual',
        is_paid: true,
        link: 'https://careers.gymshark.com/',
        requirements: ['Instagram', 'TikTok', 'Community Management'],
        salary_min: 55000,
        salary_max: 75000,
    },
    {
        title: 'Entrepreneur in Residence',
        company_name: 'Babson eTower',
        location_type: 'Onsite',
        location_specifics: 'Wellesley, MA',
        is_paid: false,
        babson_connection: 'On Campus',
        link: 'https://etower.org/',
        requirements: ['Startup Experience', 'Mentorship', 'Leadership'],
        salary_min: 0,
        salary_max: 0,
    },
]

const sampleEvents = [
    {
        title: 'Finance Networking Night',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        link: 'https://example.com/event1',
        description: 'Meet alumni in Finance.',
        location_type: 'Onsite',
        location_specifics: 'Olin Hall',
        industry: 'Venture Capital / Private Equity',
        event_type: 'Networking Event',
    },
    {
        title: 'Tech Interview Workshop',
        date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        link: 'https://example.com/event2',
        description: 'Learn how to ace technical interviews.',
        location_type: 'Virtual',
        industry: 'Technology',
        event_type: 'Workshop',
    },
]

async function generateEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    })
    return response.data[0].embedding
}

async function seed() {
    console.log('Seeding jobs...')
    for (const job of sampleJobs) {
        const textToEmbed = `${job.title} ${job.company_name} ${job.requirements.join(' ')}`
        const embedding = await generateEmbedding(textToEmbed)

        const { error } = await supabase.from('jobs').insert({
            ...job,
            embedding,
            date_posted: new Date().toISOString(),
        })

        if (error) console.error('Error inserting job:', error)
        else console.log(`Inserted job: ${job.title}`)
    }

    console.log('Seeding events...')
    for (const event of sampleEvents) {
        const textToEmbed = `${event.title} ${event.description} ${event.industry} ${event.event_type}`
        const embedding = await generateEmbedding(textToEmbed)

        const { error } = await supabase.from('events').insert({
            ...event,
            embedding,
        })

        if (error) console.error('Error inserting event:', error)
        else console.log(`Inserted event: ${event.title}`)
    }

    console.log('Done!')
}

seed()
