import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Briefcase, Calendar, 
  CheckCircle, Clock, XCircle, Eye 
} from 'lucide-react';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);

  // Mock data
  const mockApplications = [
    {
      id: 1,
      job: {
        title: 'Senior Frontend Developer',
        company: { name: 'TechCorp Inc.' }
      },
      status: 'reviewing',
      applied_at: '2025-01-20T10:00:00Z',
      updated_at: '2025-01-21T14:30:00Z'
    },
    {
      id: 2,
      job: {
        title: 'Full Stack Engineer',
        company: { name: 'StartupXYZ' }
      },
      status: 'interview',
      applied_at: '2025-01-18T15:30:00Z',
      updated_at: '2025-01-22T09:15:00Z'
    },
    {
      id: 3,
      job: {
        title: 'React Developer',
        company: { name: 'WebCorp' }
      },
      status: 'rejected',
      applied_at: '2025-01-15T12:00:00Z',
      updated_at: '2025-01-19T16:45:00Z'
    }
  ];

  const mockProfile = {
    user: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com'
    },
    user_type: 'candidate',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Passionate frontend developer with 5+ years of experience building modern web applications.',
    skills: 'React, TypeScript, Node.js, Python, AWS',
    experience_years: 5
  };

  useEffect(() => {
    setApplications(mockApplications);
    setProfile(mockProfile);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewing':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'interview':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'hired':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-green-100 text-green-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText },
    { label: 'Under Review', value: applications.filter(app => app.status === 'reviewing').length, icon: Eye },
    { label: 'Interviews', value: applications.filter(app => app.status === 'interview').length, icon: Calendar },
    { label: 'Profile Views', value: 42, icon: User }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-1">Track your applications and manage your profile</p>
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
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'applications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Applications
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.map(application => (
            <div key={application.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {application.job.title}
                  </h3>
                  <p className="text-gray-600">{application.job.company.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied on {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(application.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Start browsing jobs and submit your first application!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && profile && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.user.first_name}
                  className="input"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.user.last_name}
                  className="input"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.user.email}
                className="input"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                className="input"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={profile.location}
                className="input"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                rows={4}
                value={profile.bio}
                className="input"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input
                type="text"
                value={profile.skills}
                className="input"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                value={profile.experience_years}
                className="input"
                readOnly
              />
            </div>

            <button className="btn btn-primary">
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;