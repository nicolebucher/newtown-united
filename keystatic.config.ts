import { config, collection, singleton, fields } from '@keystatic/core';

// Lokal (npm run dev) speichert der Editor direkt in die Dateien.
// Online speichert er über Keystatic Cloud ins GitHub-Repository.
const storage = import.meta.env.PROD
  ? ({ kind: 'cloud' } as const)
  : ({ kind: 'local' } as const);

export default config({
  storage,
  cloud: { project: 'newtown-united/website' },
  locale: 'de-DE',
  ui: {
    brand: { name: 'Newtown United' },
    navigation: {
      Inhalte: ['seiten'],
      Einstellungen: ['liga', 'verein'],
    },
  },
  collections: {
    seiten: collection({
      label: 'Seiten',
      slugField: 'titel',
      path: 'src/content/seiten/*',
      format: { contentField: 'inhalt' },
      entryLayout: 'content',
      columns: ['titel', 'bereich'],
      schema: {
        titel: fields.slug({
          name: { label: 'Titel', validation: { isRequired: true } },
          slug: {
            label: 'Adresse der Seite',
            description: 'Wird Teil der Webadresse. Die Startseite heißt „start“.',
          },
        }),
        bereich: fields.select({
          label: 'Bereich',
          description: 'Legt fest, unter welchem Menüpunkt die Seite erscheint.',
          options: [
            { label: 'Eigene Seite (oberste Ebene)', value: 'keiner' },
            { label: 'Abteilung Sport', value: 'abteilung-sport' },
            { label: 'Portfolio', value: 'portfolio' },
          ],
          defaultValue: 'keiner',
        }),
        imMenue: fields.checkbox({
          label: 'Im Menü anzeigen',
          description: 'Unterseiten von Abteilung Sport und Portfolio erscheinen dort als Untermenü.',
          defaultValue: true,
        }),
        reihenfolge: fields.integer({
          label: 'Reihenfolge',
          description: 'Kleinere Zahlen stehen im Menü und in Übersichten weiter vorne.',
          defaultValue: 10,
        }),
        kicker: fields.text({ label: 'Kleine Überschrift über dem Titel' }),
        ueberschrift: fields.text({
          label: 'Große Überschrift',
          description: 'Leer lassen, dann wird der Titel verwendet.',
        }),
        einleitung: fields.text({ label: 'Einleitung', multiline: true }),
        kurzbeschreibung: fields.text({
          label: 'Kurzbeschreibung',
          description: 'Erscheint auf Karten in Übersichten und in Suchmaschinen.',
          multiline: true,
        }),
        bild: fields.image({
          label: 'Bild oben',
          directory: 'public/images/seiten',
          publicPath: '/images/seiten/',
        }),
        bildText: fields.text({ label: 'Bildbeschreibung (für Screenreader)' }),
        buttons: fields.array(
          fields.object({
            text: fields.text({ label: 'Beschriftung', validation: { isRequired: true } }),
            link: fields.text({ label: 'Link', description: 'Webadresse oder z. B. #formular' }),
            datei: fields.file({
              label: 'Oder: Datei (z. B. PDF)',
              directory: 'public/downloads',
              publicPath: '/downloads/',
            }),
            hauptbutton: fields.checkbox({ label: 'Roter Hauptbutton', defaultValue: true }),
          }),
          { label: 'Buttons', itemLabel: (p) => p.fields.text.value || 'Button' },
        ),
        infos: fields.array(
          fields.object({
            bezeichnung: fields.text({ label: 'Bezeichnung', description: 'z. B. Wann, Wo, Eintritt' }),
            wert: fields.text({ label: 'Wert' }),
          }),
          {
            label: 'Infokasten',
            description: 'Kurze Eckdaten wie Datum, Ort oder Eintritt.',
            itemLabel: (p) => `${p.fields.bezeichnung.value}: ${p.fields.wert.value}`,
          },
        ),
        downloads: fields.array(
          fields.object({
            titel: fields.text({ label: 'Titel', validation: { isRequired: true } }),
            beschreibung: fields.text({ label: 'Kurzer Text', multiline: true }),
            datei: fields.file({
              label: 'Datei (z. B. PDF)',
              directory: 'public/downloads',
              publicPath: '/downloads/',
            }),
          }),
          {
            label: 'Download-Kacheln',
            description: 'Dateien wie Mitgliedsantrag oder Regelwerk als Kachel zum Herunterladen.',
            itemLabel: (p) => p.fields.titel.value || 'Download',
          },
        ),
        karten: fields.array(fields.relationship({ label: 'Seite', collection: 'seiten' }), {
          label: 'Karten mit Links zu anderen Seiten',
          itemLabel: (p) => p.value ?? 'Seite wählen',
        }),
        ligaAnzeigen: fields.checkbox({
          label: 'Zahlen und Spieltage der BUNTEN Liga anzeigen',
          description: 'Die Daten pflegst du unter Einstellungen → BUNTE Liga.',
          defaultValue: false,
        }),
        formular: fields.conditional(
          fields.checkbox({ label: 'Kontaktformular anzeigen', defaultValue: false }),
          {
            true: fields.object({
              ueberschrift: fields.text({ label: 'Überschrift', defaultValue: 'Schreib uns' }),
              text: fields.text({ label: 'Text über dem Formular', multiline: true }),
              betreff: fields.text({ label: 'Betreff der E-Mail' }),
              buttonText: fields.text({ label: 'Text auf dem Button', defaultValue: 'Nachricht senden' }),
            }),
            false: fields.empty(),
          },
        ),
        inhalt: fields.markdoc({
          label: 'Inhalt',
          options: {
            image: { directory: 'public/images/seiten', publicPath: '/images/seiten/' },
          },
        }),
      },
    }),
  },
  singletons: {
    liga: singleton({
      label: 'BUNTE Liga',
      path: 'src/content/einstellungen/liga',
      format: 'json',
      schema: {
        saison: fields.text({ label: 'Saison', defaultValue: '2026' }),
        teams: fields.integer({ label: 'Aktive Teams' }),
        spieler: fields.integer({ label: 'Spieler:innen' }),
        spiele: fields.integer({ label: 'Gespielte Spiele' }),
        tore: fields.integer({ label: 'Tore' }),
        spieltage: fields.array(
          fields.object({
            datum: fields.date({ label: 'Datum', validation: { isRequired: true } }),
            uhrzeit: fields.text({ label: 'Uhrzeit', defaultValue: '17:30–21:00' }),
            ort: fields.text({ label: 'Ort' }),
          }),
          { label: 'Spieltage', itemLabel: (p) => `${p.fields.datum.value ?? ''} · ${p.fields.ort.value}` },
        ),
        partner: fields.array(fields.text({ label: 'Name' }), {
          label: 'Partner',
          itemLabel: (p) => p.value,
        }),
        spielplanLink: fields.url({ label: 'Link zum kompletten Spielplan' }),
        regelwerk: fields.file({
          label: 'Regelwerk (PDF)',
          directory: 'public/downloads',
          publicPath: '/downloads/',
        }),
      },
    }),
    verein: singleton({
      label: 'Verein',
      path: 'src/content/einstellungen/verein',
      format: 'json',
      schema: {
        name: fields.text({ label: 'Vereinsname', defaultValue: 'Newtown United e.V.' }),
        untertitel: fields.text({ label: 'Untertitel im Fußbereich', defaultValue: 'Sport- und Kulturverein aus Dresden' }),
        email: fields.text({ label: 'E-Mail' }),
        instagram: fields.url({ label: 'Instagram' }),
        logo: fields.image({ label: 'Logo', directory: 'public/images', publicPath: '/images/' }),
      },
    }),
  },
});
