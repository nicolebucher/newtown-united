import { config, collection, singleton, fields } from '@keystatic/core';

// Lokal (npm run dev) speichert der Editor direkt in die Dateien.
// Online speichert er über Keystatic Cloud ins GitHub-Repository.
const storage = import.meta.env.PROD
  ? ({ kind: 'cloud' } as const)
  : ({ kind: 'local' } as const);

export default config({
  storage,
  cloud: { project: 'newtown-united/newtown-united' },
  locale: 'de-DE',
  ui: {
    brand: { name: 'Newtown United – Website bearbeiten' },
    navigation: {
      'Texte und Bilder': ['seiten'],
      'Menü oben auf der Website': ['menue'],
      'BUNTE Liga und Verein': ['liga', 'verein'],
    },
  },
  collections: {
    seiten: collection({
      label: 'Seiten',
      slugField: 'titel',
      path: 'src/content/seiten/*',
      // „Vorschau“-Knopf: öffnet die veröffentlichte Seite (Änderungen erscheinen nach ein bis zwei Minuten).
      previewUrl: '/vorschau/{slug}',
      format: { contentField: 'inhalt' },
      columns: ['titel'],
      schema: {
        titel: fields.slug({
          name: {
            label: 'Seitenname',
            description: 'So heißt die Seite im Menü und im Browser-Tab.',
            validation: { isRequired: true },
          },
          slug: {
            label: 'Adresse der Seite',
            description: 'Wird Teil der Webadresse. Nach dem Veröffentlichen besser nicht mehr ändern. Die Startseite heißt „start“.',
          },
        }),

        kopf: fields.object(
          {
            ueberschrift: fields.text({
              label: 'Hauptüberschrift (H1)',
              description: 'Die große Überschrift ganz oben. Leer lassen, dann steht dort der Seitenname.',
            }),
            kicker: fields.text({
              label: 'Kleine Zeile über der Überschrift',
              description: 'Zum Beispiel „Abteilung Sport“. Kann leer bleiben.',
            }),
            einleitung: fields.text({
              label: 'Einleitung',
              description: 'Ein, zwei Sätze direkt unter der Überschrift.',
              multiline: true,
            }),
            bild: fields.image({
              label: 'Bild rechts neben der Überschrift',
              directory: 'public/images/seiten',
              publicPath: '/images/seiten/',
            }),
            bildText: fields.text({
              label: 'Was ist auf dem Bild zu sehen?',
              description: 'Kurze Beschreibung für Menschen, die das Bild nicht sehen können.',
            }),
            buttons: fields.array(
              fields.object({
                text: fields.text({ label: 'Beschriftung', validation: { isRequired: true } }),
                link: fields.text({
                  label: 'Wohin führt der Button?',
                  description: 'Eine Webadresse, eine Seite wie /mitglied-werden/ oder #formular für das Formular unten.',
                }),
                datei: fields.file({
                  label: 'Oder: Datei zum Herunterladen (z. B. PDF)',
                  directory: 'public/downloads',
                  publicPath: '/downloads/',
                }),
                hauptbutton: fields.checkbox({
                  label: 'Roter Button',
                  description: 'Aus: Der Button ist nur umrandet.',
                  defaultValue: true,
                }),
              }),
              { label: 'Buttons', itemLabel: (p) => p.fields.text.value || 'Button' },
            ),
            infos: fields.array(
              fields.object({
                bezeichnung: fields.text({ label: 'Bezeichnung', description: 'z. B. Wann, Wo, Eintritt' }),
                wert: fields.text({ label: 'Angabe' }),
              }),
              {
                label: 'Infokasten',
                description: 'Kurze Eckdaten wie Datum, Ort oder Eintritt.',
                itemLabel: (p) => `${p.fields.bezeichnung.value}: ${p.fields.wert.value}`,
              },
            ),
            titelLogo: fields.image({
              label: 'Logo statt Überschrift (nur Startseite)',
              description: 'Wenn gesetzt, steht das Logo als Hauptüberschrift oben und der Text darunter als zweite Überschrift.',
              directory: 'public/images',
              publicPath: '/images/',
            }),
          },
          {
            label: '1. Kopfbereich',
            description: 'Der obere Teil der Seite: Überschrift, Einleitung, Bild und Buttons.',
          },
        ),

        inhalt: fields.markdoc({
          label: '2. Hauptteil',
          description: 'Der eigentliche Text der Seite. Überschriften, fett, Listen, Links und Bilder über die Leiste oben.',
          options: {
            image: { directory: 'public/images/seiten', publicPath: '/images/seiten/' },
          },
        }),

        extras: fields.object(
          {
            karten: fields.array(fields.relationship({ label: 'Seite', collection: 'seiten' }), {
              label: 'Kacheln mit Links zu anderen Seiten',
              itemLabel: (p) => p.value ?? 'Seite wählen',
            }),
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
                label: 'Dateien zum Herunterladen',
                description: 'Zum Beispiel Mitgliedsantrag oder Regelwerk, als Kachel.',
                itemLabel: (p) => p.fields.titel.value || 'Download',
              },
            ),
            ligaAnzeigen: fields.checkbox({
              label: 'Zahlen und Spieltage der BUNTEN Liga anzeigen',
              description: 'Die Daten pflegst du unter Einstellungen → BUNTE Liga.',
              defaultValue: false,
            }),
            formular: fields.conditional(
              fields.checkbox({ label: 'Formular anzeigen', defaultValue: false }),
              {
                true: fields.object({
                  art: fields.select({
                    label: 'Art des Formulars',
                    options: [
                      { label: 'Kontakt (Name, E-Mail, Nachricht)', value: 'kontakt' },
                      { label: 'Team-Anmeldung (mit Teamname, Telefon, Anzahl Spieler:innen)', value: 'team' },
                    ],
                    defaultValue: 'kontakt',
                  }),
                  ueberschrift: fields.text({ label: 'Überschrift', defaultValue: 'Schreib uns' }),
                  text: fields.text({ label: 'Text über dem Formular', multiline: true }),
                  betreff: fields.text({ label: 'Betreff der E-Mail an euch' }),
                  buttonText: fields.text({ label: 'Text auf dem Button', defaultValue: 'Nachricht senden' }),
                }),
                false: fields.empty(),
              },
            ),
          },
          {
            label: '3. Unter dem Hauptteil',
            description: 'Kacheln, Downloads, Liga-Zahlen und Formular. Alles freiwillig.',
          },
        ),

        kurzbeschreibung: fields.text({
          label: 'Kurzbeschreibung für Kacheln und Google',
          description: 'Ein Satz. Erscheint, wenn andere Seiten auf diese verlinken, und in Suchergebnissen.',
          multiline: true,
        }),
      },
    }),
  },
  singletons: {
    menue: singleton({
      label: 'Menü ändern',
      path: 'src/content/einstellungen/menue',
      previewUrl: '/',
      format: 'json',
      schema: {
        punkte: fields.array(
          fields.object({
            seite: fields.relationship({
              label: 'Seite im Menü',
              collection: 'seiten',
              validation: { isRequired: true },
            }),
            unterseiten: fields.array(
              fields.relationship({ label: 'Unterseite', collection: 'seiten', validation: { isRequired: true } }),
              {
                label: 'Unterseiten (Kategorie)',
                description: 'Diese Seiten erscheinen im Aufklappmenü unter dem Menüpunkt, und ihre Adresse beginnt mit ihm.',
                itemLabel: (p) => p.value ?? 'Seite wählen',
              },
            ),
          }),
          {
            label: 'Menüpunkte',
            description: 'Neuer Menüpunkt: auf den Knopf unter der Liste klicken und eine Seite wählen. Reihenfolge per Ziehen am Griff links ändern. Zum Schluss oben rechts speichern. Seiten, die hier fehlen, gibt es trotzdem, sie stehen nur nicht im Menü.',
            itemLabel: (p) =>
              (p.fields.seite.value ?? 'Seite wählen') +
              (p.fields.unterseiten.elements.length ? ` (${p.fields.unterseiten.elements.length} Unterseiten)` : ''),
          },
        ),
      },
    }),
    liga: singleton({
      label: 'BUNTE Liga: Spieltage und Zahlen',
      path: 'src/content/einstellungen/liga',
      previewUrl: '/vorschau/bunte-liga-dresden',
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
      label: 'Vereinsdaten: E-Mail, Instagram, Logo',
      path: 'src/content/einstellungen/verein',
      previewUrl: '/',
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
