import { getStore } from "@netlify/blobs";
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });
export default async (req) => {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return json({ error: "Defina ADMIN_PASSWORD nas variáveis de ambiente do Netlify" }, 500);
  if (req.headers.get("x-admin-key") !== pw) return json({ error: "senha incorreta" }, 401);
  const store = getStore("metas99");
  if (req.method === "GET") return json((await store.get("data", { type: "json" })) || { empty: true });
  if (req.method === "PUT") { await store.setJSON("data", await req.json()); return json({ ok: true }); }
  return json({ error: "método não permitido" }, 405);
};
export const config = { path: "/api/data" };
