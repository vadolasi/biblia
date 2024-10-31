import db from "@/lib/database";
import Link from "next/link";

export function generateStaticParams() {
  const books = db.query("SELECT abreviation FROM translations").all() as { abreviation: string }[];

  return books.map(({ abreviation }) => ({
    translation: abreviation,
  }));
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ translation: string }> }>) {
  const { translation } = await params;

  const translationInfo = db.query(
    "SELECT name FROM translations WHERE abreviation = $translation",
  ).get({ $translation: translation }) as { name: string };

  return {
    title: `Livros - ${translationInfo.name}`,
    description: `Lista de livros da Bíblia - ${translationInfo.name}`,
  };
}

export default async function Page({ params }: Readonly<{ params: Promise<{ translation: string }> }>) {
  const { translation } = await params;

  const books = db.query(
    "SELECT name, abreviation, testament FROM books WHERE version = $translation ORDER BY number ASC",
  ).all({ $translation: translation }) as { abreviation: string, name: string }[];

  return (
    <div>
      <h1 className="font-bold text-lg">Livros</h1>
      <ul>
        {books.map(({ abreviation, name }) => (
          <li key={abreviation}>
            <Link href={`/${translation}/${abreviation}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
