-- This SQL function is a Supabase RPC function used for cancelling the process
-- to change the user's email
create or replace function cancel_email_change()
returns json
language plpgsql
security definer
as $$
DECLARE
_uid uuid; -- for checking by 'is not found'
user_id uuid; -- to store the user id from the request
BEGIN

  -- Get user by his current auth.uid
  user_id := auth.uid();

  -- Then clear the relevant fields on the auth.users table
  UPDATE auth.users SET
    email_change = '',
    email_change_token_current = '',
    email_change_token_new = '',
    email_change_confirm_status = 0,
    email_change_sent_at = NULL
  WHERE id = user_id;

  RETURN '{ "success": true }';
END;
$$
