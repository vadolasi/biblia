import db from "@/lib/database";

export const dynamic = "force-static"

export function GET() {
  return Response.json(db.query("SELECT * FROM translations").all())
}
