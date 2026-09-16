-- Local reference data only; no test accounts or financial records.
INSERT INTO public.country_limits(country_code,country_name,ambassador_limit) VALUES
 ('TZ','Tanzania',100),('KE','Kenya',100),('UG','Uganda',100),
 ('RW','Rwanda',100),('BI','Burundi',100),('CD','DRC',100)
ON CONFLICT(country_code) DO NOTHING;
