-- Crée la table profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  role text DEFAULT 'customer'
);

-- Crée la table merchants si elle n'existe pas
CREATE TABLE IF NOT EXISTS merchants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crée la table partner si elle n'existe pas
CREATE TABLE IF NOT EXISTS partner (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id),
  merchant_id uuid REFERENCES merchants(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crée la table customer si elle n'existe pas
CREATE TABLE IF NOT EXISTS customer (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id),
  points integer DEFAULT 0,
  merchant_id uuid REFERENCES merchants(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);