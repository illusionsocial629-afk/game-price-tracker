import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma";

const RAWG_API_KEY = process.env.RAWG_API_KEY!;

export const searchGameDb = createServerFn({ method: "GET" })
  .inputValidator((data: { query: string }) => data)

  .handler(async ({ data }) => {
    const query = data.query.trim().toLowerCase();

    if (!query) {
      return {
        source: "empty",
        games: [],
      };
    }

    // =====================================
    // 1. CHECK DATABASE CACHE
    // =====================================

    const cachedGames = await prisma.cachedGame.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },

          {
            slug: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },

      take: 12,

      orderBy: {
        createdAt: "desc",
      },
    });

    // RETURN CACHED RESULTS
    if (cachedGames.length > 0) {
      console.log("✅ Returning games from database cache");

      return {
        source: "database",
        games: cachedGames,
      };
    }

    // =====================================
    // 2. FETCH FROM RAWG
    // =====================================

    console.log("🌐 Fetching games from RAWG API");

    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(
        query
      )}&page_size=12`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch RAWG games");
    }

    const rawg = await response.json();

    const results = rawg.results || [];

    // =====================================
    // 3. SAVE TO DATABASE
    // =====================================

    const savedGames = [];

    for (const game of results) {
      try {
        const savedGame = await prisma.cachedGame.upsert({
          where: {
            rawgId: game.id,
          },

          update: {
            title: game.name,
            slug: game.slug,
            thumbnail: game.background_image || "",
            background: game.background_image || "",
            rating: game.rating || 0,
            released: game.released || "",
          },

          create: {
            rawgId: game.id,
            title: game.name,
            slug: game.slug,
            thumbnail: game.background_image || "",
            background: game.background_image || "",
            rating: game.rating || 0,
            released: game.released || "",
          },
        });

        savedGames.push(savedGame);
      } catch (error) {
        console.error("Failed saving game:", game.name, error);
      }
    }

    // =====================================
    // 4. RETURN SAVED DATA
    // =====================================

    return {
      source: "rawg",
      games: savedGames,
    };
  });