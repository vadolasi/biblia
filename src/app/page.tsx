import db from "@/lib/database";
import Link from "next/link";
import Script from "next/script";
import Devocional from "./Devocional";

export default async function TranslationsPage() {
  const translations = db.query("SELECT * FROM translations").all() as { abreviation: string, name: string }[];

  return (
    <div>
      <Devocional />
      <h1 className="font-bold text-lg mt-5">Traduções</h1>
      <ul>
        {translations.map(({ abreviation, name }) => (
          <li key={abreviation}>
            <Link href={`/${abreviation}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
