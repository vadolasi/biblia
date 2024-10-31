import db from "@/lib/database";

export function generateStaticParams() {
  const books = db.query("SELECT abreviation, version, chapters FROM books").all() as { number: number, abreviation: string, version: string, chapters: number }[];

  return books.flatMap(({ abreviation, version, chapters }) => {
    const params = [];

    for (let i = 1; i <= chapters; i++) {
      params.push({
        translation: version,
        book: abreviation,
        chapter: String(i),
      });
    }

    return params;
  });
}

export async function GET(_request: Request, { params }: Readonly<{ params: Promise<{ translation: string, book: string, chapter: number }> }>) {
  const { translation, book, chapter } = await params;

  const bookInfo = db.query(
    "SELECT name FROM books WHERE version = $translation AND abreviation = $book",
  ).get({ $translation: translation, $book: book }) as { name: string };

  const result = db.query(
    "SELECT number, text FROM verses WHERE version = $translation AND book = $book AND chapter = $chapter",
  ).all({ $translation: translation, $book: book, $chapter: chapter });

  return Response.json({ book: bookInfo.name, chapter, verses: result });
}
