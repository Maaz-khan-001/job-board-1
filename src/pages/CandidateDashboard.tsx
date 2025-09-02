import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Briefcase, Calendar, 
  CheckCircle, Clock, XCircle, Eye, Loader2 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { applicationService } from '../services/applicationService';
import { Application } from '../lib/supabase';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getMyApplications(profile?.user_id!);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
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
    { label: 'Hired', value: applications.filter(app => app.status === 'hired').length, icon: CheckCircle }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.first_name}!
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

      {/* Applications List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My Applications</h2>
        
        <div className="space-y-4">
          {applications.map(application => (
            <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {application.job?.title}
                  </h3>
                  <p className="text-gray-600">{application.job?.company?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied on {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                  {application.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      Note: {application.notes}
                    </p>
                  )}
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
      </div>
    </div>
  );
};

export default CandidateDashboard;