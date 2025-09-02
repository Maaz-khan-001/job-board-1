import React, { useState, useEffect } from 'react';
import { 
  Plus, Eye, Edit, Trash2, Users, 
  Briefcase, TrendingUp, Calendar 
} from 'lucide-react';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // Mock data
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: { name: 'TechCorp Inc.' },
      status: 'active',
      applications_count: 23,
      created_at: '2025-01-20T10:00:00Z'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: { name: 'TechCorp Inc.' },
      status: 'paused',
      applications_count: 15,
      created_at: '2025-01-18T15:30:00Z'
    }
  ];

  const mockApplications = [
    {
      id: 1,
      applicant: { first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
      job: { title: 'Senior Frontend Developer' },
      status: 'pending',
      applied_at: '2025-01-22T10:00:00Z'
    },
    {
      id: 2,
      applicant: { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
      job: { title: 'Senior Frontend Developer' },
      status: 'reviewing',
      applied_at: '2025-01-21T14:30:00Z'
    }
  ];

  useEffect(() => {
    setJobs(mockJobs);
    setApplications(mockApplications);
  }, []);

  const stats = [
    { label: 'Active Jobs', value: jobs.filter(job => job.status === 'active').length, icon: Briefcase },
    { label: 'Total Applications', value: applications.length, icon: Users },
    { label: 'Interviews Scheduled', value: 3, icon: Calendar },
    { label: 'Hired This Month', value: 2, icon: TrendingUp }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'jobs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'applications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Applications
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{job.applications_count}</p>
                    <p className="text-xs text-gray-500">Applications</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-4">Create your first job posting to start receiving applications.</p>
              <button className="btn btn-primary">Post Your First Job</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.map(application => (
            <div key={application.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {application.applicant.first_name} {application.applicant.last_name}
                  </h3>
                  <p className="text-gray-600">{application.applicant.email}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    Applied for: {application.job.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Applied {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  <button className="btn btn-outline text-sm">
                    Review Application
                  </button>
                </div>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications received</h3>
              <p className="text-gray-600">Applications will appear here once candidates start applying to your jobs.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;