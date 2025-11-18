-- === ENUMS ===
CREATE TYPE user_role AS ENUM ('user', 'admin_full', 'admin_reviewer');
CREATE TYPE artist_status AS ENUM ('pending', 'approved', 'rejected', 'disabled');
CREATE TYPE song_status AS ENUM ('pending', 'approved', 'rejected', 'deleted');
CREATE TYPE reaction_type AS ENUM ('like', 'dislike');

-- === USERS ===

CREATE TABLE IF NOT EXISTS public.users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  username      text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role          user_role NOT NULL DEFAULT 'user',

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- === ARTISTS ===
CREATE TABLE IF NOT EXISTS public.artists (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  slug          text UNIQUE NOT NULL,
  display_name  text NOT NULL,
  bio           text,
  avatar_url    text,
  banner_url    text,
  socials       jsonb, 

  status        artist_status NOT NULL DEFAULT 'pending',
  applied_at    timestamptz NOT NULL DEFAULT now(),
  approved_at   timestamptz,
  approved_by   uuid REFERENCES public.users(id),

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_artists_status ON public.artists(status);

-- === SONGS ===
CREATE TABLE IF NOT EXISTS public.songs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id      uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,

  title          text NOT NULL,
  slug           text UNIQUE NOT NULL,
  audio_url      text NOT NULL,
  cover_url      text,
  duration_sec   integer,
  has_lyrics     boolean NOT NULL DEFAULT false,
  released_at    date,

  status         song_status NOT NULL DEFAULT 'pending',
  created_at     timestamptz NOT NULL DEFAULT now(),
  approved_at    timestamptz,
  approved_by    uuid REFERENCES public.users(id),

  play_count     bigint NOT NULL DEFAULT 0,
  like_count     bigint NOT NULL DEFAULT 0,
  dislike_count  bigint NOT NULL DEFAULT 0,

  score          bigint GENERATED ALWAYS AS (
    play_count + like_count * 3 - dislike_count
  ) STORED
);

CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON public.songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_status ON public.songs(status);
CREATE INDEX IF NOT EXISTS idx_songs_score ON public.songs(score DESC);

-- === SONG REACTIONS (likes / dislikes) ===
CREATE TABLE IF NOT EXISTS public.song_reactions (
  user_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  song_id    uuid NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  reaction   reaction_type NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (user_id, song_id)
);

CREATE INDEX IF NOT EXISTS idx_song_reactions_song_id ON public.song_reactions(song_id);

-- === REFRESH TOKENS FOR YOUR JWT AUTH ===
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash  text NOT NULL,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  revoked_at  timestamptz,

  UNIQUE (token_hash)
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON public.refresh_tokens(user_id);
