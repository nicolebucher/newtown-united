import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const seiten = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/seiten' }),
  schema: z
    .object({
      titel: z.string(),
      kurzbeschreibung: z.string().nullish(),
      kopf: z
        .object({
          ueberschrift: z.string().nullish(),
          kicker: z.string().nullish(),
          einleitung: z.string().nullish(),
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
          titelLogo: z.string().nullish(),
        })
        .prefault({}),
      extras: z
        .object({
          karten: z.array(z.string()).default([]),
          downloads: z
            .array(z.object({ titel: z.string(), beschreibung: z.string().nullish(), datei: z.string().nullish() }))
            .default([]),
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
        })
        .prefault({}),
    })
    // Im Editor sind die Felder in Kopfbereich und Extras gruppiert; die Seiten lesen sie flach.
    .transform(({ kopf, extras, ...rest }) => ({ ...rest, ...kopf, ...extras })),
});

export const collections = { seiten };
