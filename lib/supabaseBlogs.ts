// lib/supabaseBlogs.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

const blogUrl = process.env.NEXT_PUBLIC_SUPABASE_BLOG_URL;
const blogServiceKey = process.env.SUPABASE_BLOG_SERVICE_ROLE_KEY;

if (!blogUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_BLOG_URL is not set");
}

if (!blogServiceKey) {
  throw new Error("SUPABASE_BLOG_SERVICE_ROLE_KEY is not set");
}

export const supabaseBlogs = createClient(blogUrl, blogServiceKey, {
  auth: { persistSession: false },
});
