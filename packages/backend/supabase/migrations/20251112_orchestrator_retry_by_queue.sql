create or replace function public.orchestrator_retry_summary(days int)
returns table(
  total_retrying int,
  total_success int,
  total_failed int,
  avg_retries numeric,
  dlq_rate numeric
) as $$
begin
  return query
  select
    sum(case when status = 'retrying' then 1 else 0 end) as total_retrying,
    sum(case when status = 'success' then 1 else 0 end) as total_success,
    sum(case when status = 'failed' then 1 else 0 end) as total_failed,
    coalesce(avg(retry_counts.c),0) as avg_retries,
    case when sum(case when status in ('success','failed') then 1 else 0 end) = 0 then 0
         else round( sum(case when status='failed' then 1 else 0 end)::numeric / greatest(sum(case when status in ('success','failed') then 1 else 0 end),1)::numeric, 4) end as dlq_rate
  from public.orchestrator_retry_log
  left join (
    select job_id, count(*) as c from public.orchestrator_retry_log where created_at > now() - (make_interval(days => days)) group by job_id
  ) retry_counts on retry_counts.job_id = orchestrator_retry_log.job_id
  where orchestrator_retry_log.created_at > now() - (make_interval(days => days));
end;
$$ language plpgsql stable;
