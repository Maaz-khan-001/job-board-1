import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';
import JobCard from '../components/JobCard';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: { name: 'TechCorp Inc.' },
      description: 'We are looking for an experienced frontend developer to join our dynamic team. You will be responsible for creating amazing user experiences using React, TypeScript, and modern web technologies.',
      location: 'New York, NY',
      remote_allowed: true,
      employment_type: 'full_time',
      experience_level: 'senior',
      salary_min: 120000,
      salary_max: 160000,
      status: 'active',
      created_at: '2025-01-20T10:00:00Z'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: { name: 'Innovation Labs' },
      description: 'Join our product team to drive the development of cutting-edge software solutions. We need someone with strong analytical skills and experience in agile methodologies.',
      location: 'San Francisco, CA',
      remote_allowed: false,
      employment_type: 'full_time',
      experience_level: 'mid',
      salary_min: 100000,
      salary_max: 140000,
      status: 'active',
      created_at: '2025-01-19T15:30:00Z'
    },
    {
      id: 3,
      title: 'Data Scientist Intern',
      company: { name: 'DataFlow Analytics' },
      description: 'Excellent opportunity for students to gain hands-on experience in data science, machine learning, and analytics in a fast-paced startup environment.',
      location: 'Austin, TX',
      remote_allowed: true,
      employment_type: 'internship',
      experience_level: 'entry',
      salary_min: null,
      salary_max: null,
      status: 'active',
      created_at: '2025-01-18T09:15:00Z'
    }
  ];

  useEffect(() => {
    setJobs(mockJobs);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.employment_type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with top companies and discover opportunities that match your skills and ambitions.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input pl-10"
            >
              <option value="">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Results */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {filteredJobs.length} Jobs Found
        </h2>
        <select className="input w-auto">
          <option>Sort by: Most Recent</option>
          <option>Sort by: Salary High to Low</option>
          <option>Sort by: Salary Low to High</option>
        </select>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default Home;