"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title")?.toString().trim();
  const body = formData.get("body")?.toString().trim();

  if (!title || !body) {
    throw new Error("Title and body are required");
  }

  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase.from("posts").insert({
    title,
    body,
    created_by: authData.user.id,
  });

  if (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }

  redirect("/members");
}