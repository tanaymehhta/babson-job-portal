import { Event } from '@/types'
import { Calendar, MapPin, Users, Tag } from 'lucide-react'
import { motion } from 'framer-motion'

interface EventCardProps {
    event: Event
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function EventCard({ event }: EventCardProps) {
    return (
        <motion.div
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                    </h3>
                    <div className="flex items-center mt-1 text-blue-600 text-sm font-medium">
                        <Tag className="h-3 w-3 mr-1" />
                        {event.event_type}
                    </div>
                </div>
                {event.similarity && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {Math.round(event.similarity * 100)}% Match
                    </span>
                )}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(event.date).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                        {event.location_type}
                        {event.location_specifics && ` • ${event.location_specifics}`}
                    </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.industry}</span>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {event.description}
            </p>

            <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 px-4 bg-gray-50 hover:bg-blue-600 text-gray-900 hover:text-white rounded-lg font-medium transition-colors duration-200"
            >
                Register for Event
            </a>
        </motion.div>
    )
}
