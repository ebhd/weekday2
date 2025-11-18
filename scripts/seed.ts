import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("Loaded env:", {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  HAS_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const STORAGE_BASE =
  "https://srfvxpxheavarzaurusd.supabase.co/storage/v1/object/public/drillrecords-assets";

async function main() {
  const { supabase } = await import("../lib/supabaseClient");

  console.log("🌱 Seeding DrillRecords data...");

  const users = [
    {
      email: "admin1@drillrecords.test",
      username: "admin_full",
      password_hash: "dev-hash-only",
      role: "admin_full" as const,
    },
    {
      email: "admin2@drillrecords.test",
      username: "admin_reviewer",
      password_hash: "dev-hash-only",
      role: "admin_reviewer" as const,
    },
    {
      email: "gherbo@drillrecords.test",
      username: "gherbo",
      password_hash: "dev-hash-only",
      role: "user" as const,
    },
    {
      email: "rowdy@drillrecords.test",
      username: "rowdy",
      password_hash: "dev-hash-only",
      role: "user" as const,
    },
    {
      email: "listener@drillrecords.test",
      username: "listener1",
      password_hash: "dev-hash-only",
      role: "user" as const,
    },
  ];

  const { data: userRows, error: userError } = await supabase
    .from("users")
    .upsert(users, { onConflict: "email" })
    .select("*");

  if (userError) {
    console.error("❌ Failed to upsert users:", userError);
    process.exit(1);
  }

  console.log("✅ Users seeded:", userRows?.length ?? 0);

  const usersByEmail = new Map(
    (userRows ?? []).map((u) => [u.email as string, u])
  );

  const adminFull = usersByEmail.get("admin1@drillrecords.test");
  const adminReviewer = usersByEmail.get("admin2@drillrecords.test");
  const gherboUser = usersByEmail.get("gherbo@drillrecords.test");
  const rowdyUser = usersByEmail.get("rowdy@drillrecords.test");

  if (!adminFull || !adminReviewer || !gherboUser || !rowdyUser) {
    console.error("❌ Missing seeded users, aborting.");
    process.exit(1);
  }

  // 2) ARTISTS
  const artists = [
    {
      user_id: gherboUser.id,
      slug: "g-herbo",
      display_name: "G Herbo",
      bio: "Chicago drill pioneer.",
      avatar_url: `${STORAGE_BASE}/avatars/g-herbo.avif`,
      banner_url: `${STORAGE_BASE}/banners/banner.png`,
      socials: { instagram: "https://instagram.com/gherbo" },
      status: "approved" as const,
      approved_at: new Date().toISOString(),
      approved_by: adminFull.id,
    },
    {
      user_id: rowdyUser.id,
      slug: "rowdy-rebel",
      display_name: "Rowdy Rebel",
      bio: null,
      avatar_url: `${STORAGE_BASE}/avatars/g-herbo.avif`,
      banner_url: `${STORAGE_BASE}/banners/banner.png`,
      socials: {},
      status: "approved" as const,
      approved_at: new Date().toISOString(),
      approved_by: adminReviewer.id,
    },
  ];

  const { data: artistRows, error: artistError } = await supabase
    .from("artists")
    .upsert(artists, { onConflict: "slug" })
    .select("*");

  if (artistError) {
    console.error("❌ Failed to upsert artists:", artistError);
    process.exit(1);
  }

  console.log("✅ Artists seeded:", artistRows?.length ?? 0);

  const artistsBySlug = new Map(
    (artistRows ?? []).map((a) => [a.slug as string, a])
  );

  const gHerboArtist = artistsBySlug.get("g-herbo");
  const rowdyArtist = artistsBySlug.get("rowdy-rebel");

  if (!gHerboArtist || !rowdyArtist) {
    console.error("❌ Missing seeded artists, aborting.");
    process.exit(1);
  }

  const nowIso = new Date().toISOString();
  const audioUrl = `${STORAGE_BASE}/songs/testsong.mp3`;

  const songs = [
    {
      artist_id: gHerboArtist.id,
      title: "Falcons",
      slug: "falcons",
      audio_url: audioUrl,
      cover_url: `${STORAGE_BASE}/covers/cover.png`,
      duration_sec: 182,
      has_lyrics: true,
      released_at: "2024-05-20",
      status: "approved" as const,
      approved_at: nowIso,
      approved_by: adminReviewer.id,
      play_count: 1500,
      like_count: 300,
      dislike_count: 10,
    },
    {
      artist_id: gHerboArtist.id,
      title: "Trenches",
      slug: "trenches",
      audio_url: audioUrl,
      cover_url: `${STORAGE_BASE}/covers/cover.png`,
      duration_sec: 205,
      has_lyrics: false,
      released_at: "2024-07-11",
      status: "approved" as const,
      approved_at: nowIso,
      approved_by: adminReviewer.id,
      play_count: 1100,
      like_count: 220,
      dislike_count: 5,
    },
    {
      artist_id: gHerboArtist.id,
      title: "No Sleep In The Trenches",
      slug: "no-sleep-in-the-trenches", // unique because of onConflict: "slug"
      audio_url: audioUrl, // same audio source
      cover_url: `${STORAGE_BASE}/covers/cover.png`,
      duration_sec: 195,
      has_lyrics: true,
      released_at: "2024-09-01",
      status: "approved" as const,
      approved_at: nowIso,
      approved_by: adminReviewer.id,
      play_count: 800,
      like_count: 160,
      dislike_count: 4,
    },
    {
      artist_id: rowdyArtist.id,
      title: "Rowdy Anthem",
      slug: "rowdy-anthem",
      audio_url: audioUrl,
      cover_url: `${STORAGE_BASE}/covers/cover.png`,
      duration_sec: 198,
      has_lyrics: true,
      released_at: "2024-03-02",
      status: "approved" as const,
      approved_at: nowIso,
      approved_by: adminFull.id,
      play_count: 1200,
      like_count: 250,
      dislike_count: 8,
    },
  ];

  const { data: songRows, error: songError } = await supabase
    .from("songs")
    .upsert(songs, { onConflict: "slug" })
    .select("*");

  if (songError) {
    console.error("❌ Failed to upsert songs:", songError);
    process.exit(1);
  }

  console.log("✅ Songs seeded:", songRows?.length ?? 0);
  console.log("🌱 Seed complete.");
}

main().catch((err) => {
  console.error("❌ Seed script crashed:", err);
  process.exit(1);
});
