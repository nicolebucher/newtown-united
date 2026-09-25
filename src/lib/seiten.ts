import fs from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import menueDaten from '../content/einstellungen/menue.json';

export type Seite = CollectionEntry<'seiten'>;

type MenueEintrag = { name?: string | null; seite: string | null };
type Menue = { punkte: (MenueEintrag & { unterseiten: MenueEintrag[] })[] };
const menue = menueDaten as Menue;

/** Oberseite laut Menü: Unterseiten bekommen deren Adresse als Präfix, z. B. /abteilung-sport/bunte-liga-dresden/. */
function oberseite(id: string): string | undefined {
  return menue.punkte.find((p) => p.seite && p.seite !== id && p.unterseiten.some((u) => u.seite === id))?.seite ?? undefined;
}

export function seitenUrl(seite: Seite | string): string {
  const id = typeof seite === 'string' ? seite : seite.id;
  if (id === 'start') return '/';
  const ober = oberseite(id);
  return ober ? `/${ober}/${id}/` : `/${id}/`;
}

export type NavItem = { label: string; href: string; children: NavItem[] };

export async function navigation(): Promise<NavItem[]> {
  const alle = await getCollection('seiten');
  const eintrag = ({ name, seite }: MenueEintrag): NavItem | null => {
    const s = alle.find((x) => x.id === seite);
    return s ? { label: name || s.data.titel, href: seitenUrl(s), children: [] } : null;
  };
  return menue.punkte.flatMap((p) => {
    const item = eintrag(p);
    if (!item) return [];
    item.children = p.unterseiten.map(eintrag).filter((x): x is NavItem => Boolean(x));
    return [item];
  });
}

/** Prüft, ob eine Datei aus /public wirklich existiert, damit fehlende Bilder nicht als kaputte Grafik erscheinen. */
export function oeffentlicheDateiExistiert(src?: string | null): src is string {
  if (!src) return false;
  if (/^https?:\/\//.test(src)) return true;
  return fs.existsSync(path.join(process.cwd(), 'public', src));
}
