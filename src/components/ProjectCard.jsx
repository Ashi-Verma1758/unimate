import React from 'react';
import { Users } from 'lucide-react';

const ProjectCard = ({ 
  author, 
  university, 
  timeAgo, 
  title, 
  description, 
  technologies = [], 
  responseCount,
  avatar
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium">
            {avatar || author.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{author}</div>
            <div className="text-sm text-gray-500">
              {university} • {timeAgo}
            </div>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View
        </button>
      </div>

      
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {title}
      </h3>

      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      
      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-gray-500 text-sm">
          <Users size={16} />
          <span>{responseCount} responses</span>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Send Request
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;