alter table public.resource_subscribers
  add column if not exists consent_at timestamptz,
  add column if not exists consent_version text,
  add column if not exists locale text,
  add column if not exists unsubscribed_at timestamptz;

comment on column public.resource_subscribers.consent_at is
  'Timestamp of the latest explicit resource/news consent.';

comment on column public.resource_subscribers.consent_version is
  'Version of the consent/privacy wording accepted.';

comment on column public.resource_subscribers.locale is
  'Locale in which consent was collected.';

comment on column public.resource_subscribers.unsubscribed_at is
  'Timestamp of unsubscribe/withdrawal when applicable.';
