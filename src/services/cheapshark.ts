const BASE_URL = "https://www.cheapshark.com/api/1.0";

export async function searchGames(title: string) {
  const response = await fetch(
    `${BASE_URL}/games?title=${encodeURIComponent(title)}&limit=20`
  );

  if (!response.ok) {
    throw new Error("Failed to search games");
  }

  return response.json();
}

export async function getDeals() {
  const response = await fetch(
    `${BASE_URL}/deals?storeID=1&pageSize=12`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch deals");
  }

  return response.json();
}

export async function getGameDetails(gameId: string) {
  const response = await fetch(
    `${BASE_URL}/games?id=${encodeURIComponent(gameId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game details");
  }

  return response.json();
}

export async function getStores() {
  const response = await fetch(`${BASE_URL}/stores`);

  if (!response.ok) {
    throw new Error("Failed to fetch stores");
  }

  return response.json();
}

export async function getRelatedGames(title: string) {
  const response = await fetch(
    `${BASE_URL}/games?title=${encodeURIComponent(title)}&limit=4`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch related games");
  }

  return response.json();
}