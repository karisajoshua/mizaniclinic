
-- Create iris_analyses table to store all iris scan reports
CREATE TABLE public.iris_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_region TEXT,
  ambassador_id TEXT,
  image_url TEXT,
  analysis_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.iris_analyses ENABLE ROW LEVEL SECURITY;

-- Users can insert their own analyses
CREATE POLICY "Users can insert own iris analyses"
  ON public.iris_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own analyses
CREATE POLICY "Users can view own iris analyses"
  ON public.iris_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin can view all analyses (using email check via auth.jwt())
CREATE POLICY "Admins can view all iris analyses"
  ON public.iris_analyses
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('admin@mizaniclinic.com', 'tessangelika@gmail.com')
  );
