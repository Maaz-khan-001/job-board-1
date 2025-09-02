import { supabase, Job, Company } from '../lib/supabase';

export interface JobFilters {
  search?: string;
  location?: string;
  employment_type?: string;
  experience_level?: string;
  remote_allowed?: boolean;
  company_id?: string;
}

export const jobService = {
  // Get all jobs with filters
  async getJobs(filters: JobFilters = {}) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        applications_count:applications(count)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.employment_type) {
      query = query.eq('employment_type', filters.employment_type);
    }

    if (filters.experience_level) {
      query = query.eq('experience_level', filters.experience_level);
    }

    if (filters.remote_allowed !== undefined) {
      query = query.eq('remote_allowed', filters.remote_allowed);
    }

    if (filters.company_id) {
      query = query.eq('company_id', filters.company_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to include applications_count
    return data?.map(job => ({
      ...job,
      applications_count: job.applications_count?.[0]?.count || 0
    })) || [];
  },

  // Get single job by ID
  async getJobById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        posted_by_profile:user_profiles!jobs_posted_by_fkey(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get jobs posted by current user
  async getMyJobs(userId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        applications_count:applications(count)
      `)
      .eq('posted_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(job => ({
      ...job,
      applications_count: job.applications_count?.[0]?.count || 0
    })) || [];
  },

  // Create new job
  async createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update job
  async updateJob(id: string, updates: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete job
  async deleteJob(id: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};