export interface User {
  id: string; // UUID, debe coincidir con auth.users.id
  email: string;
  name: string;
  username?: string | null;
  imageUrl?: string | null;
  avatar_url: string | null;
  cover_url?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  birth_date?: string | null; // usar string tipo "YYYY-MM-DD"
  phone?: string | null;
  gender?: string | null;
  is_verified?: boolean;
  is_private?: boolean;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  likes_count?: number;
  last_active?: string | null; // timestamp en ISO string
  created_at?: string; // timestamp en ISO string
  updated_at?: string; // timestamp en ISO string
}
