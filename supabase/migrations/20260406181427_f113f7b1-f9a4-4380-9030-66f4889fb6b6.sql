
-- 1. Prevent privilege escalation: trigger to block non-admin users from changing roles
CREATE OR REPLACE FUNCTION public.enforce_role_protection()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- On INSERT: non-admin users can only insert with CITIZEN role
  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin_master() THEN
      NEW.role := 'CITIZEN';
    END IF;
    RETURN NEW;
  END IF;

  -- On UPDATE: non-admin users cannot change the role column
  IF TG_OP = 'UPDATE' THEN
    IF NOT public.is_admin_master() THEN
      NEW.role := OLD.role;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_role_protection
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_role_protection();

-- 2. Tighten activity_logs: null city_hall_id logs restricted to admins only
DROP POLICY IF EXISTS "logs_select_internal" ON public.activity_logs;
CREATE POLICY "logs_select_internal" ON public.activity_logs
  FOR SELECT USING (
    CASE
      WHEN city_hall_id IS NULL THEN is_admin_master()
      ELSE can_access_city_hall(city_hall_id, ARRAY['CITY_HALL_ADMIN'::user_role, 'SECRETARY'::user_role, 'TECHNICAL'::user_role])
    END
  );

DROP POLICY IF EXISTS "logs_insert_internal" ON public.activity_logs;
CREATE POLICY "logs_insert_internal" ON public.activity_logs
  FOR INSERT WITH CHECK (
    CASE
      WHEN city_hall_id IS NULL THEN is_admin_master()
      ELSE can_access_city_hall(city_hall_id, ARRAY['CITY_HALL_ADMIN'::user_role, 'SECRETARY'::user_role, 'TECHNICAL'::user_role])
    END
  );
