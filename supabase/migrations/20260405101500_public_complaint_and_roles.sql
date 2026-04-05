-- Public complaint flow + stricter multi-tenant role isolation

-- City halls: allow public listing of active municipalities
DROP POLICY IF EXISTS city_halls_select ON public.city_halls;
CREATE POLICY city_halls_select ON public.city_halls
FOR SELECT USING (
  status = 'ATIVO'
  OR public.is_admin_master()
  OR EXISTS (
    SELECT 1
    FROM public.user_city_halls uch
    WHERE uch.city_hall_id = city_halls.id
      AND uch.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS city_halls_public_active_select ON public.city_halls;
CREATE POLICY city_halls_public_active_select ON public.city_halls
 codex/finalize-public-report-and-access-separation-v9qc6r
TO anon

 main
FOR SELECT USING (status = 'ATIVO');

-- Lighting points: allow public map access only for active city halls
DROP POLICY IF EXISTS poles_select ON public.lighting_points;
CREATE POLICY poles_select ON public.lighting_points
FOR SELECT USING (
  public.can_access_city_hall(city_hall_id, ARRAY['CITY_HALL_ADMIN', 'SECRETARY', 'TECHNICAL']::public.user_role[])
);

DROP POLICY IF EXISTS poles_select_public_active_city_hall ON public.lighting_points;
CREATE POLICY poles_select_public_active_city_hall ON public.lighting_points
 codex/finalize-public-report-and-access-separation-v9qc6r
TO anon

 main
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.city_halls ch
    WHERE ch.id = lighting_points.city_hall_id
      AND ch.status = 'ATIVO'
  )
);

-- Public complaint insert must be pending and linked to a valid city hall + pole
DROP POLICY IF EXISTS complaints_insert_public ON public.complaints;
CREATE POLICY complaints_insert_public ON public.complaints
 codex/finalize-public-report-and-access-separation-v9qc6r
TO anon

 main
FOR INSERT WITH CHECK (
  status = 'PENDENTE'
  AND lighting_point_code IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.city_halls ch
    WHERE ch.id = complaints.city_hall_id
      AND ch.status = 'ATIVO'
  )
  AND EXISTS (
    SELECT 1
    FROM public.lighting_points lp
    WHERE lp.code = complaints.lighting_point_code
      AND lp.city_hall_id = complaints.city_hall_id
  )
);

-- Ensure at least two active city halls in real/demo environments
INSERT INTO public.city_halls (id, name, city, state, cnpj, latitude, longitude, status)
VALUES ('22222222-2222-2222-2222-222222222222', 'Prefeitura de Exemplo Sul', 'Cidade Exemplo', 'MG', '98.765.432/0001-11', -15.4124, -42.2911, 'ATIVO')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  cnpj = EXCLUDED.cnpj,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  status = EXCLUDED.status;
