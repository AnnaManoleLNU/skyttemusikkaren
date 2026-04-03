"use server";

import { createClient } from "@/lib/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title")?.toString().trim();
  const body = formData.get("body")?.toString().trim();

  if (!title || !body) {
    throw new Error("Titel och innehåll krävs.");
  }

  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    throw new Error("Du är inte inloggad.");
  }

  const { error } = await supabase.from("posts").insert({
    title,
    body,
    created_by: authData.user.id,
  });

  if (error) {
    throw new Error("Kunde inte skapa inlägget.");
  }

  return { ok: true };
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    throw new Error("Du är inte inloggad.");
  }

  const postId = formData.get("post_id")?.toString();

  if (!postId) {
    throw new Error("Post-ID saknas.");
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    throw new Error("Kunde inte ta bort inlägget.");
  }

  return { ok: true };
}

export async function createComment(formData: FormData) {
  const supabase = await createClient();

  const postId = formData.get("post_id")?.toString();
  const body = formData.get("body")?.toString().trim();

  if (!postId || !body) {
    throw new Error("Kommentaren saknas.");
  }

  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    throw new Error("Du är inte inloggad.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    body,
    created_by: authData.user.id,
  });

  if (error) {
    throw new Error("Kunde inte skapa kommentaren.");
  }

  return { ok: true };
}