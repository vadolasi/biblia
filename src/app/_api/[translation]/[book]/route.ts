import db from "@/lib/database";

export function generateStaticParams() {
  const books = db.query("SELECT abreviation, version FROM books").all() as { abreviation: string, version: string }[];

  return books.map(({ abreviation, version }) => ({
    translation: version,
    book: abreviation,
  }));
}

export async function GET(_request: Request, { params }: Readonly<{ params: Promise<{ translation: string, book: string }> }>) {
  const { translation, book } = await params;

  const result = db.query(
    "SELECT name, abreviation, testament, chapters FROM books WHERE version = $translation AND abreviation = $book",
  ).get({ $translation: translation, $book: book });

  return Response.json(result);
}
