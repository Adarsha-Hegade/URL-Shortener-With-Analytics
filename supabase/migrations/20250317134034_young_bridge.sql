/*
  # Initial Schema Setup for URL Shortener

  1. New Tables
    - `shortened_urls`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_url` (text)
      - `slug` (text, unique)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, nullable)
      - `is_premium` (boolean)
    
    - `url_analytics`
      - `id` (uuid, primary key)
      - `url_id` (uuid, references shortened_urls)
      - `visitor_id` (text)
      - `device_type` (text)
      - `browser` (text)
      - `country` (text)
      - `referrer` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create shortened_urls table
CREATE TABLE IF NOT EXISTS shortened_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  original_url text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_premium boolean DEFAULT false,
  CONSTRAINT valid_url CHECK (original_url ~ '^https?://')
);

-- Create url_analytics table
CREATE TABLE IF NOT EXISTS url_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id uuid REFERENCES shortened_urls NOT NULL,
  visitor_id text NOT NULL,
  device_type text NOT NULL,
  browser text NOT NULL,
  country text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE shortened_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for shortened_urls
CREATE POLICY "Users can create their own shortened URLs"
  ON shortened_urls
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own shortened URLs"
  ON shortened_urls
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own shortened URLs"
  ON shortened_urls
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for url_analytics
CREATE POLICY "Users can view analytics for their URLs"
  ON url_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shortened_urls
      WHERE shortened_urls.id = url_analytics.url_id
      AND shortened_urls.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create analytics entries"
  ON url_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shortened_urls
      WHERE shortened_urls.id = url_id
    )
  );