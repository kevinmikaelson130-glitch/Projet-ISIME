-- Admins can list, add and remove other admins without touching user_roles directly.

CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (user_id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not_admin' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT ur.user_id, u.email::text, u.created_at, u.last_sign_in_at
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY u.created_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_admin_by_email(_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _target uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not_admin' USING ERRCODE = '42501';
  END IF;

  SELECT id INTO _target
  FROM auth.users
  WHERE lower(email) = lower(trim(_email))
  LIMIT 1;

  IF _target IS NULL THEN
    RAISE EXCEPTION 'account_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF public.has_role(_target, 'admin') THEN
    RAISE EXCEPTION 'already_admin' USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (_target, 'admin');
  RETURN _target;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_admin(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not_admin' USING ERRCODE = '42501';
  END IF;

  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'cannot_remove_self' USING ERRCODE = 'P0001';
  END IF;

  IF (SELECT count(*) FROM public.user_roles WHERE role = 'admin') <= 1 THEN
    RAISE EXCEPTION 'last_admin' USING ERRCODE = 'P0001';
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';
END;
$$;

REVOKE ALL ON FUNCTION public.list_admins() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.add_admin_by_email(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.remove_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_admin_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin(uuid) TO authenticated;