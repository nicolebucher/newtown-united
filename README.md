# newtownunited.de

Website von Newtown United e.V., gebaut mit [Astro](https://astro.build), gehostet auf Vercel.
Inhalte werden im Browser mit dem Editor [Keystatic](https://keystatic.com) gepflegt.

## Inhalte bearbeiten

Unter **newtownunited.de/keystatic** anmelden und dort bearbeiten:

- **Seiten**: alle Seiten der Website. Neue Seiten (z. B. eine neue Veranstaltung im Portfolio)
  legst du dort auch an. Über „Bereich“ bestimmst du, unter welchem Menüpunkt sie erscheint.
- **Einstellungen → BUNTE Liga**: Zahlen, Spieltage, Partner und Regelwerk.
- **Einstellungen → Verein**: Name, E-Mail, Instagram und Logo.

Nach dem Speichern ist die Änderung nach ein bis zwei Minuten online.

## Einmalige Einrichtung

1. **Vercel**: auf vercel.com „Add New Project“ wählen und dieses Repository importieren.
   Die Einstellungen erkennt Vercel selbst.
2. **Keystatic Cloud** (für die Anmeldung im Editor): auf keystatic.cloud mit GitHub anmelden,
   ein Team und ein Projekt anlegen und das Projekt mit diesem Repository verbinden.
   Den Projektnamen (Form `team/projekt`) in `keystatic.config.ts` bei `cloud.project` eintragen.
   Der kostenlose Tarif reicht für bis zu 3 Personen.
3. **Formulare**: auf web3forms.com mit der Vereins-E-Mail einen Zugangsschlüssel holen und in Vercel
   unter Settings → Environment Variables als `PUBLIC_WEB3FORMS_KEY` eintragen.

## Für Entwickler

```sh
npm install
npm run dev
```

Lokal speichert der Editor unter http://127.0.0.1:4321/keystatic direkt in die Dateien.

- Seiteninhalte: `src/content/seiten/*.mdoc`
- Einstellungen: `src/content/einstellungen/*.json`
- Editor-Felder: `keystatic.config.ts`
- Aussehen: `src/styles/global.css` und `src/layouts/Base.astro`
