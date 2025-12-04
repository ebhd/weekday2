// app/api/blog/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const blogUrl = process.env.NEXT_PUBLIC_SUPABASE_BLOG_URL;
const blogServiceKey = process.env.SUPABASE_BLOG_SERVICE_ROLE_KEY;

if (!blogUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_BLOG_URL is not set");
}
if (!blogServiceKey) {
  throw new Error("SUPABASE_BLOG_SERVICE_ROLE_KEY is not set");
}

const supabase = createClient(blogUrl, blogServiceKey, {
  auth: { persistSession: false },
});

export async function POST(req: NextRequest) {
  try {
    const { postId, authorName, body } = await req.json();

    if (!postId || !authorName || !body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const trimmedName = String(authorName).trim();
    const trimmedBody = String(body).trim();

    if (!trimmedName || !trimmedBody) {
      return NextResponse.json(
        { error: "Name and comment cannot be empty" },
        { status: 400 }
      );
    }

    if (trimmedName.length > 80 || trimmedBody.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        author_name: trimmedName,
        body: trimmedBody,
      })
      .select("*")
      .single();

    if (error) {
      console.error(" Failed to insert comment:", error);
      return NextResponse.json(
        { error: "Failed to save comment" },
        { status: 500 }
      );
    }

    const mapped = {
      id: data.id,
      authorName: data.author_name,
      body: data.body,
      isApproved: data.is_approved,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(mapped, { status: 201 });
  } catch (err) {
    console.error(" Error in comment POST handler:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
