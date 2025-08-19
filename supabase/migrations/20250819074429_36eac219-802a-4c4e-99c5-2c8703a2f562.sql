-- Create storage buckets for blog content
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('blog-images', 'blog-images', true),
  ('blog-videos', 'blog-videos', true);

-- Create RLS policies for blog images bucket
CREATE POLICY "Anyone can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own blog images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own blog images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create RLS policies for blog videos bucket
CREATE POLICY "Anyone can view blog videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-videos');

CREATE POLICY "Authenticated users can upload blog videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'blog-videos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own blog videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'blog-videos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own blog videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'blog-videos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);