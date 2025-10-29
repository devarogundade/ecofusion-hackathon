-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  wallet_address TEXT,
  hbar_balance DECIMAL(10, 2) DEFAULT 0,
  carbon_tokens DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create VERRA rounds table
CREATE TABLE public.verra_rounds (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  round_number INTEGER NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  achieved_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('completed', 'active', 'upcoming')),
  is_certified BOOLEAN DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verra_rounds ENABLE ROW LEVEL SECURITY;

-- VERRA rounds policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view VERRA rounds"
  ON public.verra_rounds FOR SELECT
  USING (true);

-- Create carbon actions table
CREATE TABLE public.carbon_actions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  action_date DATE NOT NULL,
  proof_url TEXT,
  co2_impact DECIMAL(10, 2) NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  tokens_minted DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carbon_actions ENABLE ROW LEVEL SECURITY;

-- Carbon actions policies
CREATE POLICY "Users can view their own actions"
  ON public.carbon_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions"
  ON public.carbon_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actions"
  ON public.carbon_actions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create marketplace listings table
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  price_per_token DECIMAL(10, 4) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  co2_offset DECIMAL(10, 2) NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Marketplace listings policies
CREATE POLICY "Anyone can view active listings"
  ON public.marketplace_listings FOR SELECT
  USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Users can create their own listings"
  ON public.marketplace_listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own listings"
  ON public.marketplace_listings FOR UPDATE
  USING (auth.uid() = seller_id);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_carbon_actions_updated_at
  BEFORE UPDATE ON public.carbon_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample VERRA rounds data
INSERT INTO public.verra_rounds (round_number, target_amount, achieved_amount, status, is_certified, start_date, end_date)
VALUES 
  (1, 1000000, 1000000, 'completed', true, '2024-01-01', '2024-03-31'),
  (2, 1500000, 1500000, 'completed', true, '2024-04-01', '2024-06-30'),
  (3, 2000000, 1750000, 'active', false, '2024-07-01', '2024-12-31'),
  (4, 2500000, 0, 'upcoming', false, '2025-01-01', '2025-06-30');