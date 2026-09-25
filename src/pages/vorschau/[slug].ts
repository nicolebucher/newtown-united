import type { APIRoute } from 'astro';
import { seitenUrl } from '../../lib/seiten';

// Ziel des „Preview“-Knopfs im Editor: leitet von der Seitenadresse (slug) zur echten Adresse weiter,
// auch wenn die Seite laut Menü unter einer Kategorie liegt.
export const prerender = false;

export const GET: APIRoute = ({ params, redirect }) =>
  redirect(seitenUrl(String(params.slug ?? 'start')), 302);
