"use client";

import { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { deletePost, createComment } from "./actions";
import { Button } from "@/components/ui/button";
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

type Post = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  author?: {
    id: string;
    email: string;
  };
  comments?: Comment[];
};

type Props = {
  post: Post;
  isAdmin: boolean;
};

export function PostCard({ post, isAdmin }: Props) {
  const [showComments, setShowComments] = useState(false);

  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat("sv-SE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  }

  const sortedComments = [...(post.comments ?? [])].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const commentCount = post.comments?.length ?? 0;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <CardDescription className="mt-1">
            Publicerad {formatDate(post.created_at)} av{" "}
            {post.author?.email ?? "Okänd användare"}
          </CardDescription>
        </div>

        {isAdmin && (
          <form action={deletePost}>
            <input type="hidden" name="post_id" value={post.id} />
            <Button variant="destructive" size="sm" type="submit">
              Ta bort
            </Button>
          </form>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="whitespace-pre-wrap text-sm leading-7">
          {post.body}
        </div>

        <div className="border-t pt-4">
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span>
              {commentCount} {commentCount === 1 ? "kommentar" : "kommentarer"}
            </span>
            {showComments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showComments && (
            <div className="mt-4 space-y-4">
              {sortedComments.length > 0 ? (
                <div className="space-y-2">
                  {sortedComments.map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-muted/40 p-3">
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}