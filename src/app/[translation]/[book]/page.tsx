import db from "@/lib/database";
import Link from "next/link";

export function generateStaticParams() {
  const books = db.query("SELECT abreviation, version FROM books").all() as { abreviation: string, version: string }[];

  return books.map(({ abreviation, version }) => ({
    translation: version,
    book: abreviation,
  }));
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ translation: string, book: string }> }>) {
  const { translation, book } = await params;

  const bookInfo = db.query(
    "SELECT name FROM books WHERE version = $translation AND abreviation = $book",
  ).get({ $translation: translation, $book: book }) as { name: string };

  return {
    title: `${bookInfo.name} - ${translation.toUpperCase()}`,
    description: `Lista de capítulos de ${bookInfo.name} - ${translation.toUpperCase()}`,
  };
}

export default async function Page({ params }: Readonly<{ params: Promise<{ translation: string, book: string }> }>) {
  const { translation, book } = await params;

  const bookInfo = db.query(
    "SELECT name, abreviation, testament, chapters FROM books WHERE version = $translation AND abreviation = $book",
  ).get({ $translation: translation, $book: book }) as { abreviation: string, name: string, chapters: number };

  return (
    <div>
      <h1>{bookInfo.name}</h1>
      <ul>
        {Array.from({ length: bookInfo.chapters }, (_, i) => i + 1).map((chapter) => (
          <li key={chapter}>
            <Link href={`/${translation}/${book}/${chapter}`}>{chapter}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
