CREATE OR REPLACE FUNCTION public.generate_ambassador_id(p_region text, p_country text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  country_code TEXT;
  region_code TEXT;
  next_number INTEGER;
  new_ambassador_id TEXT;
BEGIN
  CASE p_country
    WHEN 'Tanzania' THEN country_code := 'T';
    WHEN 'Kenya' THEN country_code := 'K';
    WHEN 'Uganda' THEN country_code := 'U';
    WHEN 'Rwanda' THEN country_code := 'R';
    WHEN 'Burundi' THEN country_code := 'B';
    WHEN 'South Sudan' THEN country_code := 'S';
    WHEN 'Ethiopia' THEN country_code := 'E';
    WHEN 'Somalia' THEN country_code := 'O';
    WHEN 'Djibouti' THEN country_code := 'D';
    WHEN 'Eritrea' THEN country_code := 'A';
    ELSE country_code := 'T';
  END CASE;

  CASE p_region
    WHEN 'Dar es Salaam' THEN region_code := 'DSM';
    WHEN 'Arusha' THEN region_code := 'ARU';
    WHEN 'Mwanza' THEN region_code := 'MWZ';
    WHEN 'Dodoma' THEN region_code := 'DOD';
    WHEN 'Mbeya' THEN region_code := 'MBE';
    WHEN 'Morogoro' THEN region_code := 'MOR';
    WHEN 'Tanga' THEN region_code := 'TAN';
    WHEN 'Kilimanjaro' THEN region_code := 'KIL';
    WHEN 'Nairobi' THEN region_code := 'NAI';
    WHEN 'Mombasa' THEN region_code := 'MOM';
    WHEN 'Kisumu' THEN region_code := 'KIS';
    WHEN 'Kampala' THEN region_code := 'KAM';
    WHEN 'Gulu' THEN region_code := 'GUL';
    WHEN 'Kigali' THEN region_code := 'KIG';
    WHEN 'Bujumbura' THEN region_code := 'BUJ';
    WHEN 'Juba' THEN region_code := 'JUB';
    WHEN 'Addis Ababa' THEN region_code := 'ADD';
    WHEN 'Mogadishu' THEN region_code := 'MOG';
    WHEN 'Djibouti City' THEN region_code := 'DJI';
    WHEN 'Asmara' THEN region_code := 'ASM';
    ELSE region_code := 'GEN';
  END CASE;

  SELECT COALESCE(
    MAX(
      CASE 
        WHEN ambassador_id ~ ('^MAP26-' || country_code || '\d{4}[A-Z]{3}$')
        THEN CAST(SUBSTRING(ambassador_id FROM 8 FOR 4) AS INTEGER)
        ELSE 0
      END
    ), 0
  ) + 1
  INTO next_number
  FROM profiles
  WHERE country = p_country;

  new_ambassador_id := 'MAP26-' || country_code || LPAD(next_number::TEXT, 4, '0') || region_code;

  RETURN new_ambassador_id;
END;
$function$;