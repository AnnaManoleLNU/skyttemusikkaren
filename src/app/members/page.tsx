import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout, createPost } from "./actions";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "./CreatePostDialog";
import { PostCard } from "./PostCard";


export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: tableUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  const isAdmin = tableUser?.role === "admin";

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select(
      `
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
  `,
    )
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching posts:", postsError);
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-6 md:p-10">
        <header className="p-6 ">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Intern portal</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Skyttemusikkåren
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Inloggad som {tableUser.username ?? tableUser.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && <CreatePostDialog createPost={createPost} />}

              <form action={logout}>
                <Button variant="outline" type="submit">
                  Logga ut
                </Button>
              </form>
            </div>
          </div>
        </header>

        <section className="p-2 ">
          <div className="space-y-2">
            {!posts || posts.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Inga inlägg ännu.
              </div>
            ) : (
               posts.map((post) => <PostCard key={post.id} post={post} isAdmin={isAdmin} />)
            )}
            
          </div>
        </section>
      </div>
    </main>
  );
}
