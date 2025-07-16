-- Add date_of_birth column
ALTER TABLE public.profiles
ADD COLUMN date_of_birth DATE;

-- Add a check constraint to ensure date of birth is not in the future
ALTER TABLE public.profiles
ADD CONSTRAINT check_profiles_date_of_birth CHECK (date_of_birth IS NULL OR date_of_birth < CURRENT_DATE);

-- Allow authenticated users to update their own profile (adjust 'id' if needed)
CREATE POLICY IF NOT EXISTS "Allow authenticated users to update their own profile"
ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to create their own profile
CREATE POLICY IF NOT EXISTS "Allow authenticated users to create their own profile"
ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id); 