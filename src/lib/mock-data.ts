// Mock data for GamePrice Tracker — replace with real API calls later.

export type Store = {
  id: string;
  name: string;
  short: string;
  logo: string;
  color: string;
  website: string;
};

export type GamePrice = {
  storeId: string;
  original: number;
  discounted: number;
  currency: string;
  discountPercent: number;
  link: string;
};

export type Game = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover: string; // gradient string for placeholder
  banner: string;
  genre: string[];
  platforms: string[];
  releaseDate: string;
  rating: number;
  prices: GamePrice[];
};

export const STORES: Store[] = [
  {
    id: "steam",
    name: "Steam",
    short: "ST",
    logo: "/stores/steam.svg",
    color: "from-sky-500 to-blue-700",
    website: "https://store.steampowered.com",
  },
  {
    id: "epic",
    name: "Epic Games",
    short: "EP",
    logo: "/stores/epic.svg",
    color: "from-zinc-700 to-zinc-900",
    website: "https://store.epicgames.com",
  },
  {
    id: "xbox",
    name: "Xbox",
    short: "XB",
    logo: "/stores/xbox.svg",
    color: "from-green-500 to-emerald-700",
    website: "https://xbox.com",
  },
  {
    id: "ea",
    name: "EA App",
    short: "EA",
    logo: "/stores/ea.svg",
    color: "from-red-500 to-rose-700",
    website: "https://ea.com",
  },
  {
    id: "ubisoft",
    name: "Ubisoft",
    short: "UB",
    logo: "/stores/ubisoft.svg",
    color: "from-slate-400 to-slate-700",
    website: "https://ubisoft.com",
  },
  {
    id: "psn",
    name: "PlayStation",
    short: "PS",
    logo: "/stores/playstation.svg",
    color: "from-blue-500 to-indigo-700",
    website: "https://playstation.com",
  },
  {
    id: "gplay",
    name: "Google Play",
    short: "GP",
    logo: "/stores/googleplay.svg",
    color: "from-amber-400 to-orange-600",
    website: "https://play.google.com",
  },
  {
    id: "appstore",
    name: "App Store",
    short: "AS",
    logo: "/stores/appstore.svg",
    color: "from-zinc-500 to-zinc-800",
    website: "https://apple.com/app-store",
  },
];

const cover = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

const mkPrices = (base: number, discounts: Record<string, number>): GamePrice[] =>
  STORES.map((s) => {
    const d = discounts[s.id] ?? 0;
    const original = base + (s.id === "psn" ? 5 : s.id === "xbox" ? 3 : 0);
    const discounted = +(original * (1 - d / 100)).toFixed(2);
    return {
      storeId: s.id,
      original,
      discounted,
      currency: "USD",
      discountPercent: d,
      link: "#",
    };
  });

export const GAMES: Game[] = [
  {
    id: "1",
    title: "Cyber Nexus 2099",
    slug: "cyber-nexus-2099",
    description:
      "A neon-drenched open-world RPG set in a sprawling megacity where every choice rewrites the skyline. Hack, drive, fight and uncover the truth behind the AI revolution.",
    cover: cover("#0ea5e9", "#7c3aed"),
    banner: cover("#0c4a6e", "#581c87"),
    genre: ["RPG", "Open World", "Sci-Fi"],
    platforms: ["PC", "PS5", "Xbox Series X"],
    releaseDate: "2024-11-12",
    rating: 4.6,
    prices: mkPrices(59.99, { steam: 40, epic: 35, xbox: 30, psn: 25, ea: 0, ubisoft: 0, gplay: 0, appstore: 0 }),
  },
  {
    id: "2",
    title: "Shadow of the Wolf",
    slug: "shadow-of-the-wolf",
    description: "A brutal action-stealth saga across feudal mountains. Master the blade. Become the legend.",
    cover: cover("#dc2626", "#7f1d1d"),
    banner: cover("#7f1d1d", "#1c1917"),
    genre: ["Action", "Stealth"],
    platforms: ["PC", "PS5"],
    releaseDate: "2023-03-22",
    rating: 4.8,
    prices: mkPrices(49.99, { steam: 50, epic: 45, psn: 40, xbox: 35, ea: 0, ubisoft: 0, gplay: 0, appstore: 0 }),
  },
  {
    id: "3",
    title: "Galactic Drift",
    slug: "galactic-drift",
    description: "Race across procedurally generated planets in this arcade-style space racer with split-screen co-op.",
    cover: cover("#f59e0b", "#b91c1c"),
    banner: cover("#7c2d12", "#431407"),
    genre: ["Racing", "Arcade"],
    platforms: ["PC", "Switch", "Mobile"],
    releaseDate: "2024-06-01",
    rating: 4.3,
    prices: mkPrices(29.99, { steam: 60, epic: 55, gplay: 70, appstore: 70, xbox: 0, psn: 0, ea: 0, ubisoft: 0 }),
  },
  {
    id: "4",
    title: "Eldoria: Crown of Ash",
    slug: "eldoria-crown-of-ash",
    description: "A sprawling fantasy CRPG with hand-crafted choices, romanceable companions and turn-based tactics.",
    cover: cover("#16a34a", "#064e3b"),
    banner: cover("#064e3b", "#022c22"),
    genre: ["RPG", "Fantasy", "Strategy"],
    platforms: ["PC", "PS5", "Xbox Series X"],
    releaseDate: "2024-09-15",
    rating: 4.9,
    prices: mkPrices(69.99, { steam: 20, epic: 15, psn: 10, xbox: 10, ea: 0, ubisoft: 0, gplay: 0, appstore: 0 }),
  },
  {
    id: "5",
    title: "Pixel Dungeon Heroes",
    slug: "pixel-dungeon-heroes",
    description: "Charming retro-pixel roguelike. Daily runs, 60+ heroes, infinite madness.",
    cover: cover("#ec4899", "#6d28d9"),
    banner: cover("#831843", "#4c1d95"),
    genre: ["Indie", "Roguelike"],
    platforms: ["PC", "Switch", "Mobile"],
    releaseDate: "2022-01-10",
    rating: 4.5,
    prices: mkPrices(14.99, { steam: 75, gplay: 80, appstore: 80, epic: 0, xbox: 0, psn: 0, ea: 0, ubisoft: 0 }),
  },
  {
    id: "6",
    title: "Frontline Tactics VI",
    slug: "frontline-tactics-6",
    description: "Cinematic single-player FPS with a 12-hour story campaign and a fully-featured map editor.",
    cover: cover("#0891b2", "#1e3a8a"),
    banner: cover("#0c4a6e", "#1e1b4b"),
    genre: ["FPS", "Action"],
    platforms: ["PC", "PS5", "Xbox Series X"],
    releaseDate: "2025-02-20",
    rating: 4.2,
    prices: mkPrices(59.99, { steam: 25, epic: 20, ea: 30, xbox: 15, psn: 10, ubisoft: 0, gplay: 0, appstore: 0 }),
  },
  {
    id: "7",
    title: "Harvest Haven",
    slug: "harvest-haven",
    description: "Cozy farming sim with magic, marriage and a 40-hour story. Build the village of your dreams.",
    cover: cover("#84cc16", "#15803d"),
    banner: cover("#365314", "#052e16"),
    genre: ["Simulation", "Cozy"],
    platforms: ["PC", "Switch", "Mobile"],
    releaseDate: "2023-08-08",
    rating: 4.7,
    prices: mkPrices(19.99, { steam: 50, gplay: 60, appstore: 60, epic: 0, xbox: 40, psn: 40, ea: 0, ubisoft: 0 }),
  },
  {
    id: "8",
    title: "Aether Knights Online",
    slug: "aether-knights-online",
    description: "Massive MMO with cross-platform play, raid bosses, guild wars and a player-driven economy.",
    cover: cover("#a855f7", "#312e81"),
    banner: cover("#312e81", "#0f172a"),
    genre: ["MMO", "RPG"],
    platforms: ["PC", "PS5", "Xbox Series X"],
    releaseDate: "2024-04-04",
    rating: 4.4,
    prices: mkPrices(39.99, { steam: 30, epic: 25, psn: 20, xbox: 20, ea: 0, ubisoft: 0, gplay: 0, appstore: 0 }),
  },
];

export function lowestPrice(g: Game) {
  const active = g.prices.filter((p) => p.discountPercent > 0 || p.discounted < p.original);
  const pool = active.length ? active : g.prices;
  return pool.reduce((min, p) => (p.discounted < min.discounted ? p : min), pool[0]);
}

export function getGameBySlug(slug: string) {
  return GAMES.find((g) => g.slug === slug);
}

// Synthetic price history for charts
export function priceHistory(g: Game, days = 90) {
  const base = lowestPrice(g).discounted;
  const out: { date: string; price: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const wobble = Math.sin(i / 6) * 6 + Math.cos(i / 11) * 4;
    const dip = i % 23 === 0 ? -10 : 0;
    out.push({
      date: d.toISOString().slice(5, 10),
      price: Math.max(4.99, +(base + wobble + dip + (Math.random() - 0.5) * 2).toFixed(2)),
    });
  }
  out[out.length - 1].price = base;
  return out;
}

export type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Price drop!", message: "Cyber Nexus 2099 dropped 40% on Steam.", isRead: false, createdAt: "2h ago" },
  { id: "n2", title: "New low price", message: "Shadow of the Wolf hit an all-time low on PSN.", isRead: false, createdAt: "5h ago" },
  { id: "n3", title: "Wishlist update", message: "Eldoria: Crown of Ash is now 20% off across stores.", isRead: true, createdAt: "1d ago" },
  { id: "n4", title: "Featured deal", message: "Weekend sale: 8 new titles under $20.", isRead: true, createdAt: "2d ago" },
];

export const GENRES = ["RPG", "Action", "FPS", "Racing", "Strategy", "Simulation", "Indie", "MMO", "Open World"];
export const PLATFORMS = ["PC", "PS5", "Xbox Series X", "Switch", "Mobile"];
