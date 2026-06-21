-- Create Users Table (extends Clerk auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  daily_goal_calories INTEGER DEFAULT 2000,
  daily_goal_protein INTEGER DEFAULT 150,
  daily_goal_carbs INTEGER DEFAULT 250,
  daily_goal_fat INTEGER DEFAULT 65,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create Meals Table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  image_url TEXT,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  description TEXT NOT NULL,
  calories NUMERIC(10, 2) NOT NULL,
  protein NUMERIC(10, 2) NOT NULL,
  carbs NUMERIC(10, 2) NOT NULL,
  fat NUMERIC(10, 2) NOT NULL,
  fiber NUMERIC(10, 2) DEFAULT 0,
  items JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Nutrition Summary Table
CREATE TABLE IF NOT EXISTS public.nutrition_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  total_calories NUMERIC(10, 2),
  total_protein NUMERIC(10, 2),
  total_carbs NUMERIC(10, 2),
  total_fat NUMERIC(10, 2),
  total_fiber NUMERIC(10, 2),
  meal_count INTEGER DEFAULT 0,
  water_intake INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_created_at ON public.meals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_user_date ON public.nutrition_summaries(user_id, date);

-- Enable RLS (Row Level Security)
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meals
CREATE POLICY meals_select_own ON public.meals
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY meals_insert_own ON public.meals
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY meals_update_own ON public.meals
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY meals_delete_own ON public.meals
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policies for nutrition_summaries
CREATE POLICY nutrition_select_own ON public.nutrition_summaries
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY nutrition_insert_own ON public.nutrition_summaries
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY nutrition_update_own ON public.nutrition_summaries
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-images', 'meal-images', true);

-- RLS Policy for meal images storage
CREATE POLICY meal_images_upload ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'meal-images' AND auth.role() = 'authenticated');

CREATE POLICY meal_images_select ON storage.objects
  FOR SELECT
  USING (bucket_id = 'meal-images');
