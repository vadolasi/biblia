import db from "@/lib/database";

export function generateStaticParams() {
  const books = db.query("SELECT abreviation FROM translations").all() as { abreviation: string }[];

  return books.map(({ abreviation }) => ({
    translation: abreviation,
  }));
}

export async function GET(_request: Request, { params }: Readonly<{ params: Promise<{ translation: string }> }>) {
  const { translation } = await params;

  const result = db.query(
    "SELECT name, abreviation, testament FROM books WHERE version = $translation ORDER BY number ASC",
  ).all({ $translation: translation })

  return Response.json(result);
}
