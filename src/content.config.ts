import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const seiten = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/seiten' }),
  schema: z.object({
    titel: z.string(),
    bereich: z.enum(['keiner', 'abteilung-sport', 'portfolio']).default('keiner'),
    imMenue: z.boolean().default(true),
    reihenfolge: z.number().nullish(),
    kicker: z.string().nullish(),
    titelLogo: z.string().nullish(),
    ueberschrift: z.string().nullish(),
    einleitung: z.string().nullish(),
    kurzbeschreibung: z.string().nullish(),
    bild: z.string().nullish(),
    bildText: z.string().nullish(),
    buttons: z
      .array(
        z.object({
          text: z.string(),
          link: z.string().nullish(),
          datei: z.string().nullish(),
          hauptbutton: z.boolean().default(true),
        }),
      )
      .default([]),
    infos: z.array(z.object({ bezeichnung: z.string(), wert: z.string() })).default([]),
    downloads: z
      .array(z.object({ titel: z.string(), beschreibung: z.string().nullish(), datei: z.string().nullish() }))
      .default([]),
    karten: z.array(z.string()).default([]),
    ligaAnzeigen: z.boolean().default(false),
    formular: z
      .discriminatedUnion('discriminant', [
        z.object({
          discriminant: z.literal(true),
          value: z.object({
            art: z.enum(['kontakt', 'team']).default('kontakt'),
            ueberschrift: z.string().nullish(),
            text: z.string().nullish(),
            betreff: z.string().nullish(),
            buttonText: z.string().nullish(),
          }),
        }),
        z.object({ discriminant: z.literal(false) }),
      ])
      .default({ discriminant: false }),
  }),
});

export const collections = { seiten };
