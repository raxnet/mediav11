import { D1Database, KVNamespace } from '@cloudflare/workers-types'

export async function onRequestPost(context) {
  const { request, env } = context;
  const db: D1Database = env.DB;
  const kv: KVNamespace = env.KV;
  const body = await request.json();
  const { action, sessionId, task, taskId, proof } = body;
  const session = await kv.get(`session:${sessionId}`);
  if (!session) return new Response(JSON.stringify({ error: 'Session expired' }), { status: 401 });
  const user = JSON.parse(session);

  if (action === 'create') {
    const likeTarget = task.likeTarget;
    const link = task.link;
    const title = task.title || '';
    const cost = likeTarget;
    const userData = await db.prepare('SELECT coins FROM users WHERE id = ?').bind(user.userId).first();
    if (userData.coins < cost) return new Response(JSON.stringify({ error: 'Saldo kurang' }), { status: 400 });
    await db.prepare('UPDATE users SET coins = coins - ? WHERE id = ?').bind(cost, user.userId).run();
    await db.prepare('INSERT INTO tasks (user_id, link, like_target, current_like, status, title) VALUES (?, ?, ?, 0, "open", ?)')
      .bind(user.userId, link, likeTarget, title).run();
    return new Response(JSON.stringify({ success: true }));

  } else if (action === 'list') {
    const tasks = await db.prepare('SELECT t.*, u.avatar FROM tasks t JOIN users u ON t.user_id = u.id WHERE status = "open" ORDER BY t.id DESC').all();
    return new Response(JSON.stringify(tasks.results));

  } else if (action === 'submit') {
    const submitted = await db.prepare('SELECT id FROM submissions WHERE task_id = ? AND user_id = ?')
      .bind(taskId, user.userId).first();
    if (submitted) return new Response(JSON.stringify({ error: 'Sudah submit' }), { status: 400 });
    await db.prepare('INSERT INTO submissions (task_id, user_id, proof) VALUES (?, ?, ?)').bind(taskId, user.userId, proof || '').run();
    await db.prepare('UPDATE tasks SET current_like = current_like + 1 WHERE id = ?').bind(taskId).run();
    await db.prepare('UPDATE users SET coins = coins + 1 WHERE id = ?').bind(user.userId).run();
    const tsk = await db.prepare('SELECT * FROM tasks WHERE id = ?').bind(taskId).first();
    if (tsk.current_like + 1 >= tsk.like_target) {
      await db.prepare('UPDATE tasks SET status = "closed" WHERE id = ?').bind(taskId).run();
    }
    await kv.put(`notify:${tsk.user_id}:${Date.now()}`, JSON.stringify({
      type: 'task_completed',
      taskId,
      from: user.username
    }), { expirationTtl: 86400 });
    return new Response(JSON.stringify({ success: true, link: tsk.link }));

  } else if (action === 'mytasks') {
    const tasks = await db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC').bind(user.userId).all();
    return new Response(JSON.stringify(tasks.results));

  } else if (action === 'history') {
    const history = await db.prepare('SELECT s.*, t.link, t.title FROM submissions s JOIN tasks t ON s.task_id = t.id WHERE s.user_id = ? ORDER BY s.id DESC').bind(user.userId).all();
    return new Response(JSON.stringify(history.results));
  }

  return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
}