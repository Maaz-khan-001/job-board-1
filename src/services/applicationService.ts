import { supabase, Application } from '../lib/supabase';

export const applicationService = {
  // Get applications for current user
  async getMyApplications(userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*,
          company:companies(*)
        )
      `)
      .eq('applicant_id', userId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get applications for jobs posted by current user
  async getApplicationsForMyJobs(userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs!inner(*,
          company:companies(*)
        ),
        applicant:user_profiles!applications_applicant_id_fkey(*)
      `)
      .eq('job.posted_by', userId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create new application
  async createApplication(applicationData: {
    job_id: string;
    cover_letter?: string;
    resume_url?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('applications')
      .insert({
        ...applicationData,
        applicant_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update application status
  async updateApplicationStatus(id: string, status: Application['status'], notes?: string) {
    const { data, error } = await supabase
      .from('applications')
      .update({ 
        status, 
        notes: notes || undefined,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Check if user has already applied to a job
  async hasApplied(jobId: string, userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('applicant_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};