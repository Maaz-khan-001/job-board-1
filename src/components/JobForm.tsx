import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { jobService } from '../services/jobService';
import { companyService } from '../services/companyService';
import { useAuth } from '../contexts/AuthContext';
import { Job, Company } from '../lib/supabase';

interface JobFormProps {
  job?: Job | null;
  onSave: () => void;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onSave, onCancel }) => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company_id: job?.company_id || '',
    description: job?.description || '',
    requirements: job?.requirements || '',
    location: job?.location || '',
    remote_allowed: job?.remote_allowed || false,
    employment_type: job?.employment_type || 'full_time',
    experience_level: job?.experience_level || 'mid',
    salary_min: job?.salary_min || '',
    salary_max: job?.salary_max || '',
    status: job?.status || 'draft',
    deadline: job?.deadline ? job.deadline.split('T')[0] : '',
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getMyCompanies(user!.id);
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        posted_by: user!.id,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min as string) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max as string) : null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      if (job) {
        await jobService.updateJob(job.id, jobData);
      } else {
        await jobService.createJob(jobData);
      }

      onSave();
    } catch (error: any) {
      alert(error.message || 'Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {job ? 'Edit Job' : 'Post New Job'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {loadingCompanies ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You need to create a company first before posting jobs.</p>
              <button onClick={onCancel} className="btn btn-secondary">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div>
                <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <select
                  id="company_id"
                  name="company_id"
                  required
                  value={formData.company_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type *
                  </label>
                  <select
                    id="employment_type"
                    name="employment_type"
                    required
                    value={formData.employment_type}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level *
                  </label>
                  <select
                    id="experience_level"
                    name="experience_level"
                    required
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. New York, NY"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remote_allowed"
                  name="remote_allowed"
                  type="checkbox"
                  checked={formData.remote_allowed}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remote_allowed" className="ml-2 block text-sm text-gray-700">
                  Remote work allowed
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Salary
                  </label>
                  <input
                    id="salary_min"
                    name="salary_min"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.salary_min}
                    onChange={handleChange}
                    className="input"
                    placeholder="80000"
                  />
                </div>

                <div>
                  <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Salary
                  </label>
                  <input
                    id="salary_max"
                    name="salary_max"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.salary_max}
                    onChange={handleChange}
                    className="input"
                    placeholder="120000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="input"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements *
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={6}
                  required
                  value={formData.requirements}
                  onChange={handleChange}
                  className="input"
                  placeholder="List the required skills, experience, and qualifications..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn btn-primary disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {job ? 'Update Job' : 'Post Job'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobForm;