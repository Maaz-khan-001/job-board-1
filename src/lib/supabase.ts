import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  user_id: string;
  user_type: 'candidate' | 'employer' | 'admin';
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  location?: string;
  profile_picture_url?: string;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  skills?: string;
  experience_years: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company_id: string;
  description: string;
  requirements: string;
  location: string;
  remote_allowed: boolean;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary_min?: number;
  salary_max?: number;
  status: 'draft' | 'active' | 'paused' | 'closed';
  posted_by: string;
  deadline?: string;
  created_at: string;
  updated_at: string;
  company?: Company;
  applications_count?: number;
}

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter?: string;
  resume_url?: string;
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'hired' | 'withdrawn';
  notes?: string;
  applied_at: string;
  updated_at: string;
  job?: Job;
  applicant?: UserProfile;
}

export interface Interview {
  id: string;
  application_id: string;
  interview_type: 'phone' | 'video' | 'in_person' | 'technical';
  scheduled_at: string;
  duration_minutes: number;
  interviewer_id: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  feedback?: string;
  created_at: string;
  application?: Application;
  interviewer?: UserProfile;
}