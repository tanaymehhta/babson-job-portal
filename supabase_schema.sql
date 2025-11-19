-- Enable pgvector extension
create extension if not exists vector;

-- Jobs Table
create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_posted date not null default current_date,
  company_name text not null,
  location_type text check (location_type in ('Virtual', 'Hybrid', 'Onsite')),
  location_specifics text,
  is_paid boolean default false,
  babson_connection text,
  link text,
  requirements text[], -- Array of strings for bullet points
  salary_min integer,
  salary_max integer,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events Table
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamp not null,
  link text,
  description text,
  location_type text check (location_type in ('Onsite', 'Virtual', 'Both')),
  location_specifics text,
  industry text check (industry in ('Consulting', 'Technology', 'CPG', 'Product Management', 'Healthcare', 'Venture Capital / Private Equity', 'Real Estate')),
  event_type text check (event_type in ('Networking Event', 'Employer-Sponsored', 'Workshop')),
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to search for jobs
create or replace function match_jobs (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  company_name text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    jobs.id,
    jobs.title,
    jobs.company_name,
    1 - (jobs.embedding <=> query_embedding) as similarity
  from jobs
  where 1 - (jobs.embedding <=> query_embedding) > match_threshold
  order by jobs.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create a function to search for events
create or replace function match_events (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  event_type text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    events.id,
    events.title,
    events.event_type,
    1 - (events.embedding <=> query_embedding) as similarity
  from events
  where 1 - (events.embedding <=> query_embedding) > match_threshold
  order by events.embedding <=> query_embedding
  limit match_count;
end;
$$;
