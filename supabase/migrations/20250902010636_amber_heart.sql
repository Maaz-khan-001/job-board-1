/*
  # Job ATS Platform Database Schema

  1. New Tables
    - `user_profiles` - Extended user information for candidates and employers
    - `companies` - Company information and details
    - `jobs` - Job postings with full details
    - `applications` - Job applications linking users to jobs
    - `interviews` - Interview scheduling and management

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Separate access controls for candidates vs employers
    - Secure file upload handling

  3. Features
    - User authentication with email/password
    - Role-based access (candidate/employer)
    - Job posting and application management
    - Interview scheduling
    - File uploads for resumes and company logos
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL DEFAULT 'candidate' CHECK (user_type IN ('candidate', 'employer', 'admin')),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  bio text DEFAULT '',
  location text DEFAULT '',
  profile_picture_url text DEFAULT '',
  resume_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  portfolio_url text DEFAULT '',
  skills text DEFAULT '',
  experience_years integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  website text DEFAULT '',
  logo_url text DEFAULT '',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  requirements text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  remote_allowed boolean DEFAULT false,
  employment_type text NOT NULL DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship', 'freelance')),
  experience_level text NOT NULL DEFAULT 'mid' CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
  salary_min decimal(10,2) DEFAULT NULL,
  salary_max decimal(10,2) DEFAULT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
  posted_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  deadline timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter text DEFAULT '',
  resume_url text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'rejected', 'hired', 'withdrawn')),
  notes text DEFAULT '',
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  interview_type text NOT NULL DEFAULT 'video' CHECK (interview_type IN ('phone', 'video', 'in_person', 'technical')),
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  interviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes text DEFAULT '',
  feedback text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Companies Policies
CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employers can create companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND user_type = 'employer'
    )
  );

CREATE POLICY "Company creators can update their companies"
  ON companies FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Jobs Policies
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'active' OR posted_by = auth.uid());

CREATE POLICY "Employers can create jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND user_type = 'employer'
    )
  );

CREATE POLICY "Job posters can update their jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (posted_by = auth.uid());

-- Applications Policies
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    applicant_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = applications.job_id AND jobs.posted_by = auth.uid()
    )
  );

CREATE POLICY "Candidates can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    applicant_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND user_type = 'candidate'
    )
  );

CREATE POLICY "Applicants and job posters can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    applicant_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = applications.job_id AND jobs.posted_by = auth.uid()
    )
  );

-- Interviews Policies
CREATE POLICY "Users can view interviews they're involved in"
  ON interviews FOR SELECT
  TO authenticated
  USING (
    interviewer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = interviews.application_id AND applications.applicant_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM applications 
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = interviews.application_id AND jobs.posted_by = auth.uid()
    )
  );

CREATE POLICY "Employers can create interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      JOIN jobs ON jobs.id = applications.job_id
      WHERE applications.id = interviews.application_id AND jobs.posted_by = auth.uid()
    )
  );

CREATE POLICY "Interviewers can update interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (interviewer_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON interviews(application_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();