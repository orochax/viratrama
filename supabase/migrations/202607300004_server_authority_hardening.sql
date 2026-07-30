-- The browser uses Auth and filtered Next.js DTOs. It must not query or mutate
-- authoritative game tables directly, even when an older RLS policy matches.
revoke all on public.licenses from anon, authenticated;
revoke all on public.game_sessions from anon, authenticated;
revoke all on public.players from anon, authenticated;
revoke all on public.game_events from anon, authenticated;
revoke all on public.session_player_roles from anon, authenticated;
revoke all on public.session_secret_missions from anon, authenticated;
revoke all on public.session_decisions from anon, authenticated;
revoke all on public.votes from anon, authenticated;
revoke all on public.puzzle_attempts from anon, authenticated;
revoke all on public.session_hints from anon, authenticated;
revoke all on public.session_envelopes from anon, authenticated;
revoke all on public.session_inventory from anon, authenticated;
revoke all on public.session_messages from anon, authenticated;
revoke all on public.media_transmission_events from anon, authenticated;
revoke all on public.score_events from anon, authenticated;
revoke all on public.session_restoration_items from anon, authenticated;
revoke all on public.session_locations from anon, authenticated;
revoke all on public.session_action_receipts from anon, authenticated;

-- These tables contain unreached endings, conditions, effects, puzzle hashes or
-- private transcripts. The service role is the only runtime reader.
revoke all on public.story_versions from anon, authenticated;
revoke all on public.story_endings from anon, authenticated;
revoke all on public.secret_missions from anon, authenticated;
revoke all on public.story_steps from anon, authenticated;
revoke all on public.decisions from anon, authenticated;
revoke all on public.puzzles from anon, authenticated;
revoke all on public.hints from anon, authenticated;
revoke all on public.messages from anon, authenticated;
revoke all on public.media_assets from anon, authenticated;

-- Public catalog metadata remains readable without narrative internals.
grant select on public.stories to anon, authenticated;
