CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_nsu text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid')),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  extras text NOT NULL DEFAULT '',
  amount_cents integer NOT NULL,
  paid_amount_cents integer,
  transaction_nsu text,
  invoice_slug text,
  capture_method text,
  ghl_contact_id text,
  delivered_at timestamptz,
  delivery_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;