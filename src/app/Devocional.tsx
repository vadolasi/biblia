"use client";

import useSWR from "swr";
import * as cheerio from "cheerio";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.text());

const bookToAbreviation = {
  "Gênesis": "gn",
  "Êxodo": "ex",
  "Levítico": "lv",
  "Números": "nm",
  "Deuteronômio": "dt",
  "Josué": "js",
  "Juízes": "jz",
  "Rute": "rt",
  "1 Samuel": "1sm",
  "2 Samuel": "2sm",
  "1 Reis": "1rs",
  "2 Reis": "2rs",
  "1 Crônicas": "1cr",
  "2 Crônicas": "2cr",
  "Esdras": "ed",
  "Neemias": "ne",
  "Ester": "et",
  "Jó": "jó",
  "Salmos": "sl",
  "Provérbios": "pv",
  "Eclesiastes": "ec",
  "Cânticos": "ct",
  "Isaías": "is",
  "Jeremias": "jr",
  "Lamentações": "lm",
  "Ezequiel": "ez",
  "Daniel": "dn",
  "Oséias": "os",
  "Joel": "jl",
  "Amós": "am",
  "Obadias": "ob",
  "Jonas": "jn",
  "Miquéias": "mq",
  "Naum": "na",
  "Habacuque": "hc",
  "Sofonias": "sf",
  "Ageu": "ag",
  "Zacarias": "zc",
  "Malaquias": "ml",
  "Mateus": "mt",
  "Marcos": "mc",
  "Lucas": "lc",
  "João": "jo",
  "Atos": "at",
  "Romanos": "rm",
  "1 Coríntios": "1co",
  "2 Coríntios": "2co",
  "Gálatas": "gl",
  "Efésios": "ef",
  "Filipenses": "fp",
  "Colossenses": "cl",
  "1 Tessalonicenses": "1ts",
  "2 Tessalonicenses": "2ts",
  "1 Timóteo": "1tm",
  "2 Timóteo": "2tm",
  "Tito": "tt",
  "Filemom": "fm",
  "Hebreus": "hb",
  "Tiago": "tg",
  "1 Pedro": "1pe",
  "2 Pedro": "2pe",
  "1 João": "1jo",
  "2 João": "2jo",
  "3 João": "3jo",
  "Judas": "jd",
  "Apocalipse": "ap",
};

export default function Devocional() {
  const { data, error } = useSWR(
    `https://corsproxy.io/?https://www.devocionaldiario.com.br`,
    fetcher
  )

  if (error) return <div></div>

  if (!data) return <div>carregando...</div>

  const $ = cheerio.load(data);

  const [, verseText, reference] = $("#verse > strong > em").first().text().trim().split("\"");
  const book = reference.split(" ").slice(0, -1).join(" ").trim();
  const [chapter, verse] = reference.split(" ").slice(-1)[0].split(":");

  // remove text berefore first ":"
  const mensgem = $("#in_main1 > div.marron14 > div > p:nth-child(5)").first().text().trim().split(":").slice(1).join(":").trim();

  return (
    <>
      <h1 className="font-bold text-lg">Versiculo do dia</h1>
      <div>
        <p>"{verseText}"</p>
        <Link className="font-semibold" href={`/acf/${bookToAbreviation[book as keyof typeof bookToAbreviation]}/${chapter}#${verse}`}>{book} {chapter}:{verse}</Link>
      </div>
      <h1 className="font-bold text-lg mt-5">Mensagem do dia</h1>
      <p>{mensgem}</p>
    </>
  )
}
