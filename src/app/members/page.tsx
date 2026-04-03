import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "./CreatePostDialog";
import { PostCard } from "./PostCard";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: currentUser } = await supabase
    .from("users")
    .select("id, email, username, role")
    .eq("id", authUser.id)
    .single();

  if (!currentUser) {
    redirect("/login");
  }

  const isAdmin = currentUser.role === "admin";

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:users!posts_created_by_fkey (
        id,
        email,
        username
      ),
      comments (
        id,
        body,
        created_at,
        created_by,
        author:users!comments_created_by_fkey (
          id,
          email,
          username
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6 md:p-10">
        <header className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Intern portal</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Skyttemusikkåren
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Inloggad som {currentUser.username} ({currentUser.email})
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && <CreatePostDialog />}

              <form action={logout}>
                <Button variant="outline" type="submit">
                  Logga ut
                </Button>
              </form>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          {!posts || posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-background p-10 text-center text-sm text-muted-foreground">
              Inga inlägg ännu.
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} isAdmin={isAdmin} />
            ))
          )}
        </section>
      </div>
    </main>
  );
}