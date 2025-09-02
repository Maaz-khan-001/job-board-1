import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Building2, 
  Calendar, Send, Loader2, CheckCircle 
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../contexts/AuthContext';
import { Job } from '../lib/supabase';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    resume_url: ''
  });

  useEffect(() => {
    if (id) {
      loadJob();
      if (user) {
        checkApplicationStatus();
      }
    }
  }, [id, user]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobById(id!);
      setJob(data);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!user || !id) return;
    
    try {
      const applied = await applicationService.hasApplied(id, user.id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setApplying(true);

    try {
      await applicationService.createApplication({
        job_id: id,
        cover_letter: applicationData.cover_letter,
        resume_url: applicationData.resume_url,
      });
      
      setApplying(false);
      setShowApplicationForm(false);
      setHasApplied(true);
      setApplicationData({ cover_letter: '', resume_url: '' });
    } catch (err: any) {
      setApplying(false);
      alert(err.message || 'Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
          Back to Jobs
        </button>
      </div>
    );
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const canApply = user && profile?.user_type === 'candidate' && !hasApplied;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Jobs</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-700">{job.company?.name}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                  {job.remote_allowed && (
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full">
                      Remote OK
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{job.employment_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  {job.requirements.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 text-gray-700">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {job.company?.description && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About {job.company.name}</h2>
                  <p className="text-gray-700 leading-relaxed">{job.company.description}</p>
                  {job.company.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 mt-2 inline-block"
                    >
                      Visit company website →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="text-center mb-6">
              {hasApplied ? (
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Application Submitted</span>
                </div>
              ) : canApply ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Apply Now</span>
                </button>
              ) : !user ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">Sign in to apply for this job</p>
                  <Link to="/login" className="btn btn-primary">
                    Sign In
                  </Link>
                </div>
              ) : (
                <p className="text-gray-600">
                  {profile?.user_type === 'employer' 
                    ? 'Employers cannot apply to jobs' 
                    : 'You have already applied to this job'
                  }
                </p>
              )}
              
              {job.deadline && (
                <p className="text-sm text-gray-500 mt-2">
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience Level:</span>
                <span className="font-medium capitalize">{job.experience_level.replace('_', ' ')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Employment Type:</span>
                <span className="font-medium capitalize">{job.employment_type.replace('_', ' ')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Remote Work:</span>
                <span className="font-medium">{job.remote_allowed ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Apply for {job.title}</h3>
              
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter
                  </label>
                  <textarea
                    id="cover_letter"
                    rows={6}
                    value={applicationData.cover_letter}
                    onChange={(e) => setApplicationData({...applicationData, cover_letter: e.target.value})}
                    className="input"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                <div>
                  <label htmlFor="resume_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Resume URL (optional)
                  </label>
                  <input
                    id="resume_url"
                    type="url"
                    value={applicationData.resume_url}
                    onChange={(e) => setApplicationData({...applicationData, resume_url: e.target.value})}
                    className="input"
                    placeholder="https://example.com/your-resume.pdf"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link to your resume (Google Drive, Dropbox, etc.)
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 btn btn-primary disabled:opacity-50 flex items-center justify-center"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;