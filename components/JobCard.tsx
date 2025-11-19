import { Job } from '@/types'
import { Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface JobCardProps {
    job: Job
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function JobCard({ job }: JobCardProps) {
    return (
        <motion.div
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{job.company_name}</p>
                </div>
                {job.similarity && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {Math.round(job.similarity * 100)}% Match
                    </span>
                )}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                        {job.location_type}
                        {job.location_specifics && ` • ${job.location_specifics}`}
                    </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>
                        {job.is_paid ? 'Paid' : 'Unpaid'}
                        {job.salary_min && ` • $${job.salary_min.toLocaleString()}`}
                        {job.salary_max && ` - $${job.salary_max.toLocaleString()}`}
                    </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Posted {new Date(job.date_posted).toLocaleDateString()}</span>
                </div>
            </div>

            {job.babson_connection && (
                <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-sm text-emerald-800 font-medium flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Babson Connection: {job.babson_connection}
                    </p>
                </div>
            )}

            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {job.requirements?.slice(0, 3).map((req, i) => (
                        <li key={i}>{req}</li>
                    ))}
                </ul>
            </div>

            <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 px-4 bg-gray-50 hover:bg-emerald-600 text-gray-900 hover:text-white rounded-lg font-medium transition-colors duration-200"
            >
                View Application
            </a>
        </motion.div>
    )
}
