export type NavItem = { label: string; href: string; children?: NavItem[] };

export const navigation: NavItem[] = [
  {
    label: 'Abteilung Sport',
    href: '/abteilung-sport/',
    children: [
      { label: 'BUNTE Liga Dresden', href: '/abteilung-sport/bunte-liga-dresden/' },
      { label: 'Ping Pong United', href: '/abteilung-sport/ping-pong-united/' },
      { label: 'Sport für Alle', href: '/abteilung-sport/sport-fuer-alle/' },
    ],
  },
  { label: 'LOUD & UNITED', href: '/loud-united/' },
  { label: 'Blind Kick', href: '/blind-kick/' },
  {
    label: 'Portfolio',
    href: '/portfolio/',
    children: [
      { label: 'Lesung „Freunde“', href: '/portfolio/lesung-freunde/' },
      { label: 'Oi! the Cup 2025', href: '/portfolio/oi-the-cup-2025/' },
    ],
  },
  { label: 'Impressum', href: '/impressum/' },
];
