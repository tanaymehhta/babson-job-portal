'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { JobCard } from '@/components/JobCard'
import { EventCard } from '@/components/EventCard'
import { Job, Event } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSparkle } from '@/components/AnimatedSparkle'

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setHasSearched(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setJobs(data.jobs || [])
      setEvents(data.events || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4 h-24 items-center">
              <AnimatedSparkle />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-4">
              Babson Job Portal
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 backdrop-blur-sm bg-white/30 rounded-lg p-2">
              Find your next opportunity or event using natural language.
              Just describe what you're looking for.
            </p>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Jobs */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recommended Jobs
                  </h2>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {jobs.length} found
                  </span>
                </div>
                {jobs.length > 0 ? (
                  <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                    <p className="text-gray-500">No matching jobs found.</p>
                  </div>
                )}
              </section>

              {/* Events */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Upcoming Events
                  </h2>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {events.length} found
                  </span>
                </div>
                {events.length > 0 ? (
                  <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                    <p className="text-gray-500">No matching events found.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <p className="text-gray-400 text-lg">
                Try searching for "marketing internships in Boston" or "finance networking events"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
