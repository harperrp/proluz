
-- 1. Fix is_admin_master to be SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin_master()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN'
  );
$$;

-- 2. Fix user_has_role to be SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.user_has_role(allowed_roles user_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = ANY(allowed_roles)
  );
$$;

-- 3. Fix belongs_to_city_hall to be SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.belongs_to_city_hall(target_city_hall uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin_master()
  OR EXISTS (
    SELECT 1
    FROM public.user_city_halls uch
    WHERE uch.user_id = auth.uid()
      AND uch.city_hall_id = target_city_hall
  );
$$;

-- 4. Fix can_access_city_hall to be SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.can_access_city_hall(target_city_hall uuid, allowed_roles user_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin_master()
  OR (
    public.user_has_role(allowed_roles)
    AND EXISTS (
      SELECT 1
      FROM public.user_city_halls uch
      WHERE uch.user_id = auth.uid()
        AND uch.city_hall_id = target_city_hall
    )
  );
$$;

-- 5. Create trigger for auto-creating profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  fallback_name text;
BEGIN
  fallback_name := COALESCE(
    new.raw_user_meta_data ->> 'full_name',
    split_part(COALESCE(new.email, ''), '@', 1),
    'Usuário'
  );

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, fallback_name, 'CITIZEN')
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;

-- 6. Add updated_at triggers
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['city_halls','complaints','lighting_points','maintenance_orders','profiles'])
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_' || tbl) THEN
      EXECUTE format(
        'CREATE TRIGGER set_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()',
        tbl, tbl
      );
    END IF;
  END LOOP;
END
$$;
