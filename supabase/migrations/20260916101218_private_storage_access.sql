-- Deploy the bundled public/branding assets before this migration. The other
-- applications sharing these buckets must use authenticated downloads/signed
-- URLs for private files. No objects are deleted or assigned a new owner.
INSERT INTO storage.buckets(id,name,public) VALUES
 ('oleifera','oleifera',false),('mizaniclinic','mizaniclinic',false),('som','som',false),
 ('wealthywithyou','wealthywithyou',false),('gachiku','gachiku',false)
ON CONFLICT(id) DO NOTHING;
UPDATE storage.buckets SET public=false WHERE id IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku');

DROP POLICY IF EXISTS "Public read access to public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Owners can update their files" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete their files" ON storage.objects;
DROP POLICY IF EXISTS "Admins manage all files" ON storage.objects;
-- Restrictive policy makes other pre-existing permissive policies unable to
-- reopen these five buckets. Service-role operations still bypass RLS.
CREATE POLICY "Private clinic buckets boundary" ON storage.objects AS RESTRICTIVE FOR ALL TO authenticated
 USING (bucket_id NOT IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku') OR
   (auth.uid() IS NOT NULL AND (owner_id=auth.uid()::text OR public.has_role(auth.uid(),'admin'))))
 WITH CHECK (bucket_id NOT IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku') OR
   (auth.uid() IS NOT NULL AND (owner_id=auth.uid()::text OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "Members manage their private files" ON storage.objects FOR ALL TO authenticated
 USING (bucket_id IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku') AND
   (owner_id=auth.uid()::text OR public.has_role(auth.uid(),'admin')))
 WITH CHECK (bucket_id IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku') AND
   (owner_id=auth.uid()::text OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "Anonymous private buckets boundary" ON storage.objects AS RESTRICTIVE FOR ALL TO anon
 USING (bucket_id NOT IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku'))
 WITH CHECK (bucket_id NOT IN ('oleifera','mizaniclinic','som','wealthywithyou','gachiku'));
