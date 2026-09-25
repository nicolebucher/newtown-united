import fs from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Seite = CollectionEntry<'seiten'>;

export function seitenUrl(seite: Seite): string {
  if (seite.id === 'start') return '/';
  const { bereich } = seite.data;
  return bereich === 'keiner' ? `/${seite.id}/` : `/${bereich}/${seite.id}/`;
}

const sortiert = (a: Seite, b: Seite) =>
  (a.data.reihenfolge ?? 99) - (b.data.reihenfolge ?? 99) || a.data.titel.localeCompare(b.data.titel, 'de');

export type NavItem = { label: string; href: string; children: NavItem[] };

export async function navigation(): Promise<NavItem[]> {
  const alle = (await getCollection('seiten')).filter((s) => s.data.imMenue).sort(sortiert);
  return alle
    .filter((s) => s.data.bereich === 'keiner')
    .map((s) => ({
      label: s.data.titel,
      href: seitenUrl(s),
      children: alle
        .filter((kind) => kind.data.bereich === s.id)
        .map((kind) => ({ label: kind.data.titel, href: seitenUrl(kind), children: [] })),
    }));
}

/** Prüft, ob eine Datei aus /public wirklich existiert, damit fehlende Bilder nicht als kaputte Grafik erscheinen. */
export function oeffentlicheDateiExistiert(src?: string | null): src is string {
  if (!src) return false;
  if (/^https?:\/\//.test(src)) return true;
  return fs.existsSync(path.join(process.cwd(), 'public', src));
}
