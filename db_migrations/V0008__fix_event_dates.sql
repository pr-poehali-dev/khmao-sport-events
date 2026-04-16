UPDATE t_p2335699_khmao_sport_events.events SET
  date = CASE id
    WHEN 10 THEN '2026-05-10'::date
    WHEN 11 THEN '2026-05-15'::date
    WHEN 12 THEN '2026-06-07'::date
    WHEN 13 THEN '2026-04-28'::date
    WHEN 14 THEN '2026-05-22'::date
    ELSE date
  END,
  end_date = CASE id
    WHEN 10 THEN '2026-05-12'::date
    WHEN 11 THEN '2026-05-17'::date
    WHEN 12 THEN '2026-06-07'::date
    WHEN 13 THEN '2026-04-30'::date
    WHEN 14 THEN '2026-05-23'::date
    ELSE end_date
  END
WHERE id IN (10, 11, 12, 13, 14);