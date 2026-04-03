"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createPost(data: FormData) {
  const supabase = await createClient();
  const title = data.get("title") as string;
  const body = data.get("body") as string;

  const { error } = await supabase.from("posts").insert({ title, body });
  console.log("Post creation result:", { title, body, error }); // Log the result for debugging

  if (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }

  redirect("/members");
}