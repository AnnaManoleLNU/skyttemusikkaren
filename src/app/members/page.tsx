import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout, createPost } from "./actions";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "./CreatePostDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

  const isUserAdmin = tableUser?.role === "admin";

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching posts:", postsError);
  }

  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat("sv-SE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6 md:p-10">
        <header className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Intern portal</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Skyttemusikkåren
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Inloggad som {data.user.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isUserAdmin && <CreatePostDialog createPost={createPost} />}

              <form action={logout}>
                <Button variant="outline" type="submit">
                  Logga ut
                </Button>
              </form>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Inlägg</h2>
              <p className="text-sm text-muted-foreground">
                Här visas interna nyheter och information för medlemmar.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {!posts || posts.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Inga inlägg ännu.
              </div>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="rounded-2xl">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Publicerad {formatDate(post.created_at)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                      {post.body}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}