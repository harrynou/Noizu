export type Providers = "spotify" | "soundcloud";

export interface User {
  userId: number;
}

export interface FavoriteDataType {
  trackId: string;
  favoritedAt: string;
}

export interface SearchItemType {
  id: string;
  name: string;
  imageUrl: string | null;
}
