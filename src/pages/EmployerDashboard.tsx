import React, { useState, useEffect } from 'react';
import { 
  Plus, Eye, Edit, Trash2, Users, 
  Briefcase, TrendingUp, Calendar, Loader2 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { Job, Application } from '../lib/supabase';
import JobForm from '../components/JobForm';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsData, applicationsData] = await Promise.all([
        jobService.getMyJobs(user!.id),
        applicationService.getApplicationsForMyJobs(user!.id)
      ]);
      setJobs(jobsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSaved = () => {
    setShowJobForm(false);
    setEditingJob(null);
    loadData();
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      loadData();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      loadData();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
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

  const stats = [
    { label: 'Active Jobs', value: jobs.filter(job => job.status === 'active').length, icon: Briefcase },
    { label: 'Total Applications', value: applications.length, icon: Users },
    { label: 'Pending Review', value: applications.filter(app => app.status === 'pending').length, icon: Calendar },
    { label: 'Hired This Month', value: applications.filter(app => app.status === 'hired').length, icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
        </div>
        <button 
          onClick={() => setShowJobForm(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
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
                  <p className="text-gray-600">{job.company?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{job.applications_count || 0}</p>
                    <p className="text-xs text-gray-500">Applications</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setEditingJob(job);
                        setShowJobForm(true);
                      }}
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
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
              <button 
                onClick={() => setShowJobForm(true)}
                className="btn btn-primary"
              >
                Post Your First Job
              </button>
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
                    {application.applicant?.first_name} {application.applicant?.last_name}
                  </h3>
                  <p className="text-gray-600">{application.job?.title}</p>
                  <p className="text-sm text-gray-500">
                    Applied {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                  {application.cover_letter && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {application.cover_letter}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusUpdate(application.id, e.target.value as Application['status'])}
                    className="input text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Under Review</option>
                    <option value="interview">Interview</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
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

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          job={editingJob}
          onSave={handleJobSaved}
          onCancel={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployerDashboard;