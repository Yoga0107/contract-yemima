/*
  # Relationship Contract System

  1. New Tables
    - `contracts`
      - `id` (uuid, primary key)
      - `title` (text) - Contract title
      - `created_at` (timestamptz) - When contract was created
      - `completed_at` (timestamptz) - When both parties signed
      - `status` (text) - pending, completed
    
    - `contract_terms`
      - `id` (uuid, primary key)
      - `contract_id` (uuid, foreign key)
      - `term_text` (text) - The agreement term
      - `term_order` (integer) - Order of the term
      - `created_at` (timestamptz)
    
    - `signatures`
      - `id` (uuid, primary key)
      - `contract_id` (uuid, foreign key)
      - `name` (text) - Name of the person
      - `role` (text) - boyfriend or girlfriend
      - `signed_at` (timestamptz) - When they signed
      - `message` (text) - Optional message

  2. Security
    - Enable RLS on all tables
    - Allow public read access for demonstration
    - Allow public insert/update for this romantic app
*/

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Our Relationship Contract',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed'))
);

-- Create contract_terms table
CREATE TABLE IF NOT EXISTS contract_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  term_text text NOT NULL,
  term_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create signatures table
CREATE TABLE IF NOT EXISTS signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('boyfriend', 'girlfriend')),
  signed_at timestamptz DEFAULT now(),
  message text
);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- Create policies for contracts
CREATE POLICY "Anyone can view contracts"
  ON contracts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create contracts"
  ON contracts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update contracts"
  ON contracts FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for contract_terms
CREATE POLICY "Anyone can view contract terms"
  ON contract_terms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create contract terms"
  ON contract_terms FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for signatures
CREATE POLICY "Anyone can view signatures"
  ON signatures FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create signatures"
  ON signatures FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contract_terms_contract_id ON contract_terms(contract_id);
CREATE INDEX IF NOT EXISTS idx_signatures_contract_id ON signatures(contract_id);
