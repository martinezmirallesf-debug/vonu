-- Supabase Data API: explicit opt-in for new objects as of October 2026.
-- Existing ACLs/RLS are preserved; these replay-only grants match audited access.
-- Always GRANT in the same migration that creates each future public object.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE USAGE, SELECT ON SEQUENCES FROM anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Replay the effective grants audited on 2026-10-20. Skip missing historical objects.
DO $data_api_baseline$
BEGIN
  IF to_regprocedure('public."commit_vonu_device_analysis"(uuid)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."commit_vonu_device_analysis"(uuid) TO service_role'; END IF;
  IF to_regprocedure('public."consume_vonu_device_analysis"(uuid)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."consume_vonu_device_analysis"(uuid) TO service_role'; END IF;
  IF to_regprocedure('public."enable_rls_on_new_table"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."enable_rls_on_new_table"() TO service_role'; END IF;
  IF to_regprocedure('public."enable_rls_on_new_table"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."enable_rls_on_new_table"() TO anon'; END IF;
  IF to_regprocedure('public."enable_rls_on_new_table"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."enable_rls_on_new_table"() TO authenticated'; END IF;
  IF to_regprocedure('public."fake_analyze"(text, text, text, text)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."fake_analyze"(text, text, text, text) TO service_role'; END IF;
  IF to_regprocedure('public."get_vonu_device_entitlement"(uuid)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."get_vonu_device_entitlement"(uuid) TO service_role'; END IF;
  IF to_regprocedure('public."grant_vonu_device_pack"(uuid, text, integer, bigint, text, text, text)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."grant_vonu_device_pack"(uuid, text, integer, bigint, text, text, text) TO service_role'; END IF;
  IF to_regprocedure('public."handle_new_user"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."handle_new_user"() TO service_role'; END IF;
  IF to_regprocedure('public."release_vonu_device_analysis"(uuid)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."release_vonu_device_analysis"(uuid) TO service_role'; END IF;
  IF to_regprocedure('public."reserve_vonu_device_analysis"(uuid, uuid)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."reserve_vonu_device_analysis"(uuid, uuid) TO service_role'; END IF;
  IF to_regprocedure('public."search_fraud_reports_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_fraud_reports_basic"(text, integer) TO service_role'; END IF;
  IF to_regprocedure('public."search_fraud_reports_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_fraud_reports_basic"(text, integer) TO anon'; END IF;
  IF to_regprocedure('public."search_fraud_reports_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_fraud_reports_basic"(text, integer) TO authenticated'; END IF;
  IF to_regprocedure('public."search_fraud_reports_cases_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_fraud_reports_cases_basic"(text, integer) TO service_role'; END IF;
  IF to_regprocedure('public."search_fraud_reports_cases_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_fraud_reports_cases_basic"(text, integer) TO anon'; END IF;
  IF to_regprocedure('public."search_fraud_reports_cases_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_fraud_reports_cases_basic"(text, integer) TO authenticated'; END IF;
  IF to_regprocedure('public."search_legal_consumer_patterns_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_legal_consumer_patterns_basic"(text, integer) TO service_role'; END IF;
  IF to_regprocedure('public."search_legal_consumer_patterns_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_legal_consumer_patterns_basic"(text, integer) TO anon'; END IF;
  IF to_regprocedure('public."search_legal_consumer_patterns_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_legal_consumer_patterns_basic"(text, integer) TO authenticated'; END IF;
  IF to_regprocedure('public."search_personal_safety_patterns_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_personal_safety_patterns_basic"(text, integer) TO service_role'; END IF;
  IF to_regprocedure('public."search_personal_safety_patterns_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_personal_safety_patterns_basic"(text, integer) TO anon'; END IF;
  IF to_regprocedure('public."search_personal_safety_patterns_basic"(text, integer)') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."search_personal_safety_patterns_basic"(text, integer) TO authenticated'; END IF;
  IF to_regprocedure('public."set_updated_at"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."set_updated_at"() TO service_role'; END IF;
  IF to_regprocedure('public."set_updated_at"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."set_updated_at"() TO anon'; END IF;
  IF to_regprocedure('public."set_updated_at"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."set_updated_at"() TO authenticated'; END IF;
  IF to_regprocedure('public."touch_chat_thread_on_message"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."touch_chat_thread_on_message"() TO service_role'; END IF;
  IF to_regprocedure('public."touch_chat_thread_on_message"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."touch_chat_thread_on_message"() TO anon'; END IF;
  IF to_regprocedure('public."touch_chat_thread_on_message"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."touch_chat_thread_on_message"() TO authenticated'; END IF;
  IF to_regprocedure('public."touch_thread_updated_at"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."touch_thread_updated_at"() TO service_role'; END IF;
  IF to_regprocedure('public."touch_thread_updated_at"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."touch_thread_updated_at"() TO anon'; END IF;
  IF to_regprocedure('public."touch_thread_updated_at"()') IS NOT NULL THEN EXECUTE 'GRANT EXECUTE ON FUNCTION public."touch_thread_updated_at"() TO authenticated'; END IF;
  IF to_regclass('public."subscriptions_id_seq"') IS NOT NULL THEN EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public."subscriptions_id_seq" TO service_role'; END IF;
  IF to_regclass('public."subscriptions_id_seq"') IS NOT NULL THEN EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public."subscriptions_id_seq" TO anon'; END IF;
  IF to_regclass('public."subscriptions_id_seq"') IS NOT NULL THEN EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public."subscriptions_id_seq" TO authenticated'; END IF;
  IF to_regclass('public."usage_topups_id_seq"') IS NOT NULL THEN EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public."usage_topups_id_seq" TO service_role'; END IF;
  IF to_regclass('public."usage_topups_id_seq"') IS NOT NULL THEN EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public."usage_topups_id_seq" TO anon'; END IF;
  IF to_regclass('public."usage_topups_id_seq"') IS NOT NULL THEN EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public."usage_topups_id_seq" TO authenticated'; END IF;
  IF to_regclass('public."analyses"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."analyses" TO service_role'; END IF;
  IF to_regclass('public."analyses"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."analyses" TO anon'; END IF;
  IF to_regclass('public."analyses"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."analyses" TO authenticated'; END IF;
  IF to_regclass('public."chat_messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."chat_messages" TO service_role'; END IF;
  IF to_regclass('public."chat_messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."chat_messages" TO anon'; END IF;
  IF to_regclass('public."chat_messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."chat_messages" TO authenticated'; END IF;
  IF to_regclass('public."chat_threads"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."chat_threads" TO service_role'; END IF;
  IF to_regclass('public."chat_threads"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."chat_threads" TO anon'; END IF;
  IF to_regclass('public."chat_threads"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."chat_threads" TO authenticated'; END IF;
  IF to_regclass('public."contact_messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."contact_messages" TO service_role'; END IF;
  IF to_regclass('public."contact_messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."contact_messages" TO anon'; END IF;
  IF to_regclass('public."contact_messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."contact_messages" TO authenticated'; END IF;
  IF to_regclass('public."fraud_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_chat_reports" TO service_role'; END IF;
  IF to_regclass('public."fraud_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_chat_reports" TO anon'; END IF;
  IF to_regclass('public."fraud_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_chat_reports" TO authenticated'; END IF;
  IF to_regclass('public."fraud_entities"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_entities" TO service_role'; END IF;
  IF to_regclass('public."fraud_entities"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_entities" TO anon'; END IF;
  IF to_regclass('public."fraud_entities"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_entities" TO authenticated'; END IF;
  IF to_regclass('public."fraud_indicators"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_indicators" TO service_role'; END IF;
  IF to_regclass('public."fraud_indicators"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_indicators" TO anon'; END IF;
  IF to_regclass('public."fraud_indicators"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_indicators" TO authenticated'; END IF;
  IF to_regclass('public."fraud_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_patterns" TO service_role'; END IF;
  IF to_regclass('public."fraud_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_patterns" TO anon'; END IF;
  IF to_regclass('public."fraud_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_patterns" TO authenticated'; END IF;
  IF to_regclass('public."fraud_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_reports" TO service_role'; END IF;
  IF to_regclass('public."fraud_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_reports" TO anon'; END IF;
  IF to_regclass('public."fraud_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_reports" TO authenticated'; END IF;
  IF to_regclass('public."fraud_response_rules"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_response_rules" TO service_role'; END IF;
  IF to_regclass('public."fraud_response_rules"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_response_rules" TO anon'; END IF;
  IF to_regclass('public."fraud_response_rules"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_response_rules" TO authenticated'; END IF;
  IF to_regclass('public."fraud_sources"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_sources" TO service_role'; END IF;
  IF to_regclass('public."fraud_sources"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_sources" TO anon'; END IF;
  IF to_regclass('public."fraud_sources"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."fraud_sources" TO authenticated'; END IF;
  IF to_regclass('public."legal_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."legal_chat_reports" TO service_role'; END IF;
  IF to_regclass('public."legal_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."legal_chat_reports" TO anon'; END IF;
  IF to_regclass('public."legal_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."legal_chat_reports" TO authenticated'; END IF;
  IF to_regclass('public."legal_consumer_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."legal_consumer_patterns" TO service_role'; END IF;
  IF to_regclass('public."legal_consumer_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."legal_consumer_patterns" TO anon'; END IF;
  IF to_regclass('public."legal_consumer_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."legal_consumer_patterns" TO authenticated'; END IF;
  IF to_regclass('public."messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."messages" TO service_role'; END IF;
  IF to_regclass('public."messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."messages" TO anon'; END IF;
  IF to_regclass('public."messages"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."messages" TO authenticated'; END IF;
  IF to_regclass('public."personal_safety_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."personal_safety_chat_reports" TO service_role'; END IF;
  IF to_regclass('public."personal_safety_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."personal_safety_chat_reports" TO anon'; END IF;
  IF to_regclass('public."personal_safety_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."personal_safety_chat_reports" TO authenticated'; END IF;
  IF to_regclass('public."personal_safety_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."personal_safety_patterns" TO service_role'; END IF;
  IF to_regclass('public."personal_safety_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."personal_safety_patterns" TO anon'; END IF;
  IF to_regclass('public."personal_safety_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."personal_safety_patterns" TO authenticated'; END IF;
  IF to_regclass('public."phone_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."phone_chat_reports" TO service_role'; END IF;
  IF to_regclass('public."phone_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."phone_chat_reports" TO anon'; END IF;
  IF to_regclass('public."phone_chat_reports"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."phone_chat_reports" TO authenticated'; END IF;
  IF to_regclass('public."phone_risk_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."phone_risk_patterns" TO service_role'; END IF;
  IF to_regclass('public."phone_risk_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."phone_risk_patterns" TO anon'; END IF;
  IF to_regclass('public."phone_risk_patterns"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."phone_risk_patterns" TO authenticated'; END IF;
  IF to_regclass('public."plans"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."plans" TO service_role'; END IF;
  IF to_regclass('public."plans"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."plans" TO anon'; END IF;
  IF to_regclass('public."plans"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."plans" TO authenticated'; END IF;
  IF to_regclass('public."profiles"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."profiles" TO service_role'; END IF;
  IF to_regclass('public."profiles"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."profiles" TO anon'; END IF;
  IF to_regclass('public."profiles"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."profiles" TO authenticated'; END IF;
  IF to_regclass('public."resource_subscribers"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."resource_subscribers" TO service_role'; END IF;
  IF to_regclass('public."resource_subscribers"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."resource_subscribers" TO anon'; END IF;
  IF to_regclass('public."resource_subscribers"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."resource_subscribers" TO authenticated'; END IF;
  IF to_regclass('public."subscriptions"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."subscriptions" TO service_role'; END IF;
  IF to_regclass('public."subscriptions"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."subscriptions" TO anon'; END IF;
  IF to_regclass('public."subscriptions"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."subscriptions" TO authenticated'; END IF;
  IF to_regclass('public."threads"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."threads" TO service_role'; END IF;
  IF to_regclass('public."threads"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."threads" TO anon'; END IF;
  IF to_regclass('public."threads"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."threads" TO authenticated'; END IF;
  IF to_regclass('public."usage"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."usage" TO service_role'; END IF;
  IF to_regclass('public."usage"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."usage" TO anon'; END IF;
  IF to_regclass('public."usage"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."usage" TO authenticated'; END IF;
  IF to_regclass('public."usage_topups"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."usage_topups" TO service_role'; END IF;
  IF to_regclass('public."usage_topups"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."usage_topups" TO anon'; END IF;
  IF to_regclass('public."usage_topups"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."usage_topups" TO authenticated'; END IF;
  IF to_regclass('public."vonu_analysis_reservations"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."vonu_analysis_reservations" TO service_role'; END IF;
  IF to_regclass('public."vonu_device_purchases"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."vonu_device_purchases" TO service_role'; END IF;
  IF to_regclass('public."vonu_device_usage"') IS NOT NULL THEN EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."vonu_device_usage" TO service_role'; END IF;
END;
$data_api_baseline$;

-- Exercise the post-cutover table lifecycle; test table is removed in the same migration.
CREATE TABLE public.__data_api_grants_smoke_20261020 (id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY);
DO $smoke_before$ BEGIN
  IF has_table_privilege('anon', 'public.__data_api_grants_smoke_20261020', 'SELECT')
  OR has_table_privilege('authenticated', 'public.__data_api_grants_smoke_20261020', 'SELECT')
  OR has_table_privilege('service_role', 'public.__data_api_grants_smoke_20261020', 'SELECT') THEN
    RAISE EXCEPTION 'New table inherited Data API grants unexpectedly';
  END IF;
END $smoke_before$;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.__data_api_grants_smoke_20261020 TO service_role;
DO $smoke_after$ BEGIN
  IF NOT has_table_privilege('service_role','public.__data_api_grants_smoke_20261020','SELECT')
  OR has_table_privilege('anon','public.__data_api_grants_smoke_20261020','SELECT') THEN
    RAISE EXCEPTION 'Explicit service_role grant smoke test failed';
  END IF;
END $smoke_after$;
DROP TABLE public.__data_api_grants_smoke_20261020;
DO $verify$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
   WHERE n.nspname='public' AND c.relkind IN ('r','p') AND (NOT c.relrowsecurity
   OR NOT has_table_privilege('service_role',c.oid,'SELECT')
   OR NOT has_table_privilege('service_role',c.oid,'INSERT')
   OR NOT has_table_privilege('service_role',c.oid,'UPDATE')
   OR NOT has_table_privilege('service_role',c.oid,'DELETE'))) THEN
     RAISE EXCEPTION 'Existing table missing RLS/service_role grant';
  END IF;
END $verify$;
