-- Per-course review aggregates, computed in the database so pages don't
-- download every review row. security_invoker keeps RLS in force.
create view public.course_rating_stats with (security_invoker = true) as
select
  c.id,
  c.course_code,
  c.course_name,
  c.type,
  count(r.id)::int as review_count,
  round(avg(r.rating), 2)::float as avg_rating,
  round(avg(r.workload), 2)::float as avg_workload,
  round(avg(r.grading_fairness), 2)::float as avg_grading
from public.courses c
left join public.reviews r on r.course_id = c.id
group by c.id;
