"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createPost } from "./actions";
import { PromiseForm } from "@/components/promise-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nytt inlägg
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Skapa nytt inlägg</DialogTitle>
          <DialogDescription>
            Publicera ett internt meddelande för medlemmarna i Skyttemusikkåren.
          </DialogDescription>
        </DialogHeader>

        <PromiseForm
          action={createPost}
          loading="Skapar inlägg..."
          success="Inlägg skapat!"
          error="Kunde inte skapa inlägg."
          className="space-y-5"
        >
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titel
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Till exempel: Ändrad repetitionstid"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Inlägg
            </label>
            <Textarea
              id="body"
              name="body"
              required
              rows={8}
              placeholder="Skriv ditt meddelande här..."
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Avbryt
            </Button>
            <Button type="submit">Publicera</Button>
          </DialogFooter>
        </PromiseForm>
      </DialogContent>
    </Dialog>
  );
}