
-- Confirmar o email do usuário stark@redenexus.top
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'stark@redenexus.top' 
AND email_confirmed_at IS NULL;
