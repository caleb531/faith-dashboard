-- This SQL function is a Supabase RPC function used for changing the user
-- password in a way that requires the current password for authentication
-- purposes (source:
-- <https://github.com/supabase/supabase/discussions/4042#discussioncomment-1707356>)
create or replace function change_user_password(
  current_password varchar,
  new_password varchar
)
returns json
language plpgsql
security definer
as $$
DECLARE
_uid uuid; -- for checking by 'is not found'
user_id uuid; -- to store the user id from the request
BEGIN
  -- First of all check the new password rules
  -- not empty
  IF (new_password = '') IS NOT FALSE THEN
    RAISE EXCEPTION 'New password is empty';
  -- minimum 8 chars
  ELSIF char_length(new_password) < 8 THEN
    RAISE EXCEPTION 'New password must be at least 8 characters in length';
  END IF;

  -- Get user by his current auth.uid and current password
  user_id := auth.uid();
  SELECT id INTO _uid
  FROM auth.users
  WHERE id = user_id
  AND encrypted_password =
  crypt(current_password::text, auth.users.encrypted_password);

  -- Check the currect password
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Current password is incorrect';
  END IF;

  -- Then set the new password
  UPDATE auth.users SET
  encrypted_password =
  crypt(new_password, gen_salt('bf'))
  WHERE id = user_id;

  RETURN '{ "success": true }';
END;
$$
