# newtownunited.de

Website von Newtown United e.V., gebaut mit [Astro](https://astro.build), gehostet auf Vercel.

## Lokal starten

```sh
npm install
npm run dev
```

## Inhalte ändern

- Seiten: `src/pages/`
- Menü: `src/data/navigation.ts`
- Spieltage und Zahlen der BUNTEN Liga: `src/data/liga.json`
- Bilder: `public/images/`, PDFs: `public/downloads/`

## Formulare

Die Formulare laufen über Web3Forms. Den Schlüssel als Umgebungsvariable
`PUBLIC_WEB3FORMS_KEY` in Vercel eintragen.
