import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma";

export const toggleWishlistDb = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      userId: string;
      gameId: string;
      title: string;
      image?: string;
      cheapest?: string;
      source?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const existing = await prisma.wishlist.findFirst({
      where: {
        userId: data.userId,
        gameId: data.gameId,
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: {
          id: existing.id,
        },
      });

      return {
        added: false,
      };
    }

    await prisma.wishlist.create({
      data: {
        userId: data.userId,
        gameId: data.gameId,
        title: data.title,
        image: data.image,
        cheapest: data.cheapest,
        source: data.source,
      },
    });

    return {
      added: true,
    };
  });