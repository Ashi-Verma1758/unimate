import React from 'react'
import './StatsCard.css'
const StatsCard = ({ number, label }) => {
    return (
        <div className="stats-card ">
            <div className="stats-number">
                {number}
            </div>
            <div className="stats-label">
                {label}
            </div>
        </div>
    )
}

export default StatsCard;