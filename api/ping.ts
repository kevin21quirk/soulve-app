export default function handler(req: any, res: any) {
  res.status(200).json({ ok: true, hasDbUrl: Boolean(process.env.DATABASE_URL) });
}
