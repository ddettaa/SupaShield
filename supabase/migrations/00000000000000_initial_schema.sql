-- ==========================================
-- SUPASHIELD SECURE DATABASE SCHEMA
-- ==========================================

-- Enable the "uuid-ossp" extension if it isn't already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- Store user profile information. securely tied to auth.users.
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
-- Anyone can read public profiles
CREATE POLICY "Public profiles are visible to everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);


-- 2. LEADERBOARD TABLE
-- To demonstrate the "Leaderboard Cheats" fix mentioned in the landing page
CREATE TABLE public.leaderboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL,
    game_mode TEXT NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent ridiculous cheating scores at the database level using a CHECK constraint
    CONSTRAINT max_score_check CHECK (score <= 100000)
);

-- Enable RLS for leaderboards
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Policies for leaderboards
-- Anyone can view the leaderboard (e.g., for global rankings)
CREATE POLICY "Leaderboard is visible to everyone" 
ON public.leaderboards FOR SELECT 
USING (true);

-- Only authenticated users can insert their own scores
CREATE POLICY "Users can insert their own scores" 
ON public.leaderboards FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users cannot update their existing scores (they must achieve a new high score entry)
-- Or if we allow updating, they can only update their own
CREATE POLICY "Users can only update their own scores" 
ON public.leaderboards FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 3. SCAN LOGS TABLE
-- For the database testing tool (To save vulnerability scan histories)
CREATE TABLE public.scan_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    target_db_url TEXT NOT NULL,
    vulnerabilities_found INTEGER DEFAULT 0,
    scan_report JSONB DEFAULT '{}'::jsonb,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for scan_logs
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- Policies for scan_logs
-- Users can only see their own scan logs (preventing exposure of private target DB info)
CREATE POLICY "Users can view their own scan logs" 
ON public.scan_logs FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own scan logs
CREATE POLICY "Users can insert their own scan logs" 
ON public.scan_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Scan logs are immutable (no updates allowed to maintain audit integrity)
-- No UPDATE or DELETE policies intentionally.
