import { D1Database, KVNamespace } from '@cloudflare/workers-types'

export async function onRequestPost(context) {
  const { request, env } = context;
  const db: D1Database = env.DB;
  const kv: KVNamespace = env.KV;
  const body = await request.json();
  const { action, username, password, avatar, bio, sessionId } = body;

  if (action === 'register') {
    if (!username || !password) return new Response(JSON.stringify({ error: 'Username & Password wajib' }), { status: 400 });
    const exists = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
    if (exists) return new Response(JSON.stringify({ error: 'Username sudah digunakan' }), { status: 400 });
    await db.prepare('INSERT INTO users (username, password, coins, avatar, bio) VALUES (?, ?, 10, ?, ?)')
      .bind(username, password, avatar || '', bio || '').run();
    return new Response(JSON.stringify({ success: true }));

  } else if (action === 'login') {
    const user = await db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').bind(username, password).first();
    if (!user) return new Response(JSON.stringify({ error: 'Login gagal' }), { status: 401 });
    const sessionId = crypto.randomUUID();
    await kv.put(`session:${sessionId}`, JSON.stringify({ userId: user.id, username: user.username }), { expirationTtl: 86400 });
    return new Response(JSON.stringify({ sessionId }));

  } else if (action === 'getUser') {
    const session = await kv.get(`session:${sessionId}`);
    if (!session) return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401 });
    const user = JSON.parse(session);
    const dbUser = await db.prepare('SELECT id, username, coins, avatar, bio FROM users WHERE id = ?').bind(user.userId).first();
    return new Response(JSON.stringify(dbUser));

  } else if (action === 'editProfile') {
    const session = await kv.get(`session:${sessionId}`);
    if (!session) return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401 });
    const user = JSON.parse(session);
    await db.prepare('UPDATE users SET avatar = ?, bio = ? WHERE id = ?').bind(avatar, bio, user.userId).run();
    return new Response(JSON.stringify({ success: true }));
  }

  return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
}