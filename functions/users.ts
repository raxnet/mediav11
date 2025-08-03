import { D1Database } from '@cloudflare/workers-types'

export async function onRequestGet(context) {
  const { env, request } = context;
  const db: D1Database = env.DB;
  const url = new URL(request.url);
  const leaderboard = url.searchParams.get('leaderboard');
  if (leaderboard) {
    const users = await db.prepare('SELECT id, username, coins, avatar FROM users ORDER BY coins DESC LIMIT 10').all();
    return new Response(JSON.stringify(users.results));
  }
  const users = await db.prepare('SELECT id, username, coins, avatar FROM users').all();
  return new Response(JSON.stringify(users.results));
}