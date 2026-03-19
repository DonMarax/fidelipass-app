ALTER TABLE merchants 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free', -- Pour savoir s'ils payent ou non
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());