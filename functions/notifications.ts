import { KVNamespace } from '@cloudflare/workers-types'

export async function onRequestPost(context) {
  const { env, request } = context;
  const kv: KVNamespace = env.KV;
  const body = await request.json();
  const { sessionId } = body;
  const session = await kv.get(`session:${sessionId}`);
  if (!session) return new Response(JSON.stringify([]));
  const user = JSON.parse(session);
  const keys = await kv.list({ prefix: `notify:${user.userId}:` });
  const notifs = [];
  for (const k of keys.keys) {
    const val = await kv.get(k.name);
    if (val) notifs.push(JSON.parse(val));
  }
  return new Response(JSON.stringify(notifs));
}