import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout, createPost, createComment } from "./actions";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "./CreatePostDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  body: string;
  created_at: string;
  created_by: string;
  author?: {
    id: string;
    email: string;
  };
};


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
    .select(
      `
    *,
    author:users!posts_created_by_fkey (
      id,
      email
    ),
    comments (
      id,
      body,
      created_at,
      created_by,
      author:users!comments_created_by_fkey (
        id,
        email
      )
    )
  `,
    )
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
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-6 md:p-10">
        <header className="p-6 ">
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

        <section className="p-6 ">
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
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Publicerad {formatDate(post.created_at)} av{" "}
                      {post.author?.email ?? "Okänd användare"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                      {post.body}
                    </div>

                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-sm font-semibold">Kommentarer</h3>

                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-3">
                          {[...post.comments]
                            .sort(
                              (a, b) =>
                                new Date(a.created_at).getTime() -
                                new Date(b.created_at).getTime(),
                            )
                            .map((comment: Comment) => (
                              <div
                                key={comment.id}
                                className="c p-2"
                              >
                                <p className="whitespace-pre-wrap text-sm leading-6">
                                  {comment.body}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {comment.author?.email ?? "Okänd användare"} •{" "}
                                  {formatDate(comment.created_at)}
                                </p>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Inga kommentarer ännu.
                        </p>
                      )}

                      <form action={createComment} className="space-y-3">
                        <input type="hidden" name="post_id" value={post.id} />
                        <Textarea
                          name="body"
                          placeholder="Skriv en kommentar..."
                          rows={3}
                          required
                        />
                        <Button type="submit" variant="secondary">
                          Lägg till kommentar
                        </Button>
                      </form>
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
