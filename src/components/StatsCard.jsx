import React from 'react'

const StatsCard = ({ number, label }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border-grey-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className={`text-4xl font-bold mb-2`}>
                {number}
            </div>
            <div className="text-gray-600 text-sm font-medium">
                {label}
            </div>
        </div>
    )
}

export default StatsCard;