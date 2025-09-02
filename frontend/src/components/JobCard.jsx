import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building2 } from 'lucide-react';

const JobCard = ({ job }) => {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max.toLocaleString()}`;
  };

  const getExperienceLevel = (level) => {
    const levels = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior Level',
      'lead': 'Lead',
      'executive': 'Executive'
    };
    return levels[level] || level;
  };

  const getEmploymentType = (type) => {
    const types = {
      'full_time': 'Full Time',
      'part_time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'freelance': 'Freelance'
    };
    return types[type] || type;
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link to={`/jobs/${job.id}`} className="group">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {job.title}
            </h3>
          </Link>
          <div className="flex items-center space-x-2 mt-1">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700 font-medium">{job.company?.name}</span>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            job.status === 'active' ? 'bg-green-100 text-green-800' :
            job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
          {job.remote_allowed && (
            <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full">
              Remote OK
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{getEmploymentType(job.employment_type)}</span>
          <span>•</span>
          <span>{getExperienceLevel(job.experience_level)}</span>
        </div>

        {(job.salary_min || job.salary_max) && (
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
        )}
      </div>

      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
        {job.description?.substring(0, 150)}...
      </p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted {new Date(job.created_at).toLocaleDateString()}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="btn btn-primary text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;