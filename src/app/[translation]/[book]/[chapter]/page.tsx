import db from "@/lib/database";
import Link from "next/link";

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

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ translation: string, book: string, chapter: number }> }>) {
  const { translation, book, chapter } = await params;

  const bookInfo = db.query(
    "SELECT name FROM books WHERE version = $translation AND abreviation = $book",
  ).get({ $translation: translation, $book: book }) as { name: string };

  const verses = db.query(
    "SELECT text, number FROM verses WHERE version = $translation AND book = $book AND chapter = $chapter",
  ).all({ $translation: translation, $book: book, $chapter: chapter }) as { text: string, number: number }[];

  return {
    title: `${bookInfo.name} ${chapter} - ${translation.toUpperCase()}`,
    description: verses.map(({ text, number }) => `${number} ${text}`).join(" "),
  };
}

export default async function Page({ params }: Readonly<{ params: Promise<{ translation: string, book: string, chapter: number }> }>) {
  const { translation, book, chapter } = await params;

  const bookInfo = db.query(
    "SELECT name, chapters FROM books WHERE version = $translation AND abreviation = $book",
  ).get({ $translation: translation, $book: book }) as { name: string, chapters: number };

  const verses = db.query(
    "SELECT number, text FROM verses WHERE version = $translation AND book = $book AND chapter = $chapter",
  ).all({ $translation: translation, $book: book, $chapter: chapter }) as { number: number, text: string }[];

  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <div className="w-full md:w-2/3 space-y-2">
        <h1 className="text-2xl mb-8">{bookInfo.name} {chapter}</h1>
        {verses.map(({ number, text }) => (
          <p key={number} id={String(number)}>
            <sup className="font-bold">{number}</sup> {text}
          </p>
        ))}
      </div>
      <div className="w-full md:w-1/3">
        <ul className="grid grid-cols-5 lg:grid-cols-10 gap-2 w-full">
          {Array.from({ length: bookInfo.chapters }, (_, i) => i + 1).map((chapter) => (
            <li key={chapter}>
              <Link href={`/${translation}/${book}/${chapter}`}>{chapter}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
