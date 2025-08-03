import { D1Database, KVNamespace } from '@cloudflare/workers-types'

export async function onRequestPost(context) {
  const { request, env } = context;
  const db: D1Database = env.DB;
  const kv: KVNamespace = env.KV;
  const body = await request.json();
  const { action, sessionId, targetUser, amount } = body;
  const session = await kv.get(`session:${sessionId}`);
  if (!session) return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401 });
  const user = JSON.parse(session);

  if (action === 'get') {
    const userData = await db.prepare('SELECT coins FROM users WHERE id = ?').bind(user.userId).first();
    return new Response(JSON.stringify({ coins: userData.coins }));

  } else if (action === 'transfer') {
    const userData = await db.prepare('SELECT coins FROM users WHERE id = ?').bind(user.userId).first();
    if (userData.coins < amount) return new Response(JSON.stringify({ error: 'Saldo kurang' }), { status: 400 });
    const target = await db.prepare('SELECT id FROM users WHERE username = ?').bind(targetUser).first();
    if (!target) return new Response(JSON.stringify({ error: 'User tidak ditemukan' }), { status: 400 });
    await db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').bind(amount, user.userId).run();
    await db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').bind(amount, target.id).run();
    await kv.put(`notify:${target.id}:${Date.now()}`, JSON.stringify({
      type: 'coin_received',
      from: user.username,
      amount
    }), { expirationTtl: 86400 });
    return new Response(JSON.stringify({ success: true }));
  }

  return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
}