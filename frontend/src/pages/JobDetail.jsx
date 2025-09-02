import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Building2, 
  Calendar, Users, FileText, Send 
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    resume: null
  });

  // Mock job data
  const mockJob = {
    id: 1,
    title: 'Senior Frontend Developer',
    company: { 
      name: 'TechCorp Inc.',
      description: 'Leading technology company focused on innovative solutions.',
      website: 'https://techcorp.com',
      logo: null
    },
    description: `We are looking for an experienced frontend developer to join our dynamic team. You will be responsible for creating amazing user experiences using React, TypeScript, and modern web technologies.

As a Senior Frontend Developer, you will:
• Build and maintain scalable web applications
• Collaborate with designers and backend developers
• Mentor junior developers
• Participate in code reviews and architectural decisions
• Stay up-to-date with the latest frontend technologies`,
    requirements: `Required Skills:
• 5+ years of experience with React and TypeScript
• Strong knowledge of modern CSS and responsive design
• Experience with state management (Redux, Zustand)
• Familiarity with testing frameworks (Jest, React Testing Library)
• Knowledge of build tools and CI/CD processes

Nice to Have:
• Experience with Next.js
• Knowledge of GraphQL
• Experience with micro-frontends
• Familiarity with design systems`,
    location: 'New York, NY',
    remote_allowed: true,
    employment_type: 'full_time',
    experience_level: 'senior',
    salary_min: 120000,
    salary_max: 160000,
    status: 'active',
    created_at: '2025-01-20T10:00:00Z',
    deadline: '2025-02-20T23:59:59Z',
    posted_by: { username: 'hr_manager', first_name: 'Sarah', last_name: 'Johnson' }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJob(mockJob);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      // API call would go here
      console.log('Application submitted:', applicationData);
      
      setTimeout(() => {
        setApplying(false);
        setShowApplicationForm(false);
        alert('Application submitted successfully!');
      }, 1000);
      
    } catch (err) {
      setApplying(false);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
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

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max.toLocaleString()}`;
  };

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
                <span className="text-lg font-medium text-gray-700">{job.company.name}</span>
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
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="text-center mb-6">
              <button
                onClick={() => setShowApplicationForm(true)}
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Apply Now</span>
              </button>
              
              <p className="text-sm text-gray-500 mt-2">
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
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
              
              <div className="flex justify-between">
                <span className="text-gray-600">Posted by:</span>
                <span className="font-medium">{job.posted_by.first_name} {job.posted_by.last_name}</span>
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
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Resume (PDF, DOC, DOCX)
                  </label>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setApplicationData({...applicationData, resume: e.target.files[0]})}
                    className="input"
                    required
                  />
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
                    className="flex-1 btn btn-primary disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
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