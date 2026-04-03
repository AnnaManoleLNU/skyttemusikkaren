"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage("Det gick inte att skicka inloggningslänken. Kontrollera e-postadressen och försök igen.");
      return;
    }

    setMessage("Vi har skickat en inloggningslänk till din e-postadress.");
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center p-6 md:p-10">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          <section className="hidden md:block">
            <p className="text-sm font-medium text-muted-foreground">Intern portal</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Skyttemusikkåren
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground">
              Logga in för att läsa interna nyheter, information och uppdateringar
              för medlemmar i Skyttemusikkåren.
            </p>
          </section>

          <Card className="w-full max-w-md border-0 shadow-lg md:ml-auto md:border">
            <CardHeader className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Mail className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl">Logga in</CardTitle>
              <CardDescription>
                Ange din e-postadress så skickar vi en säker inloggningslänk.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={sendMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-postadress
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="namn@epost.se"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Skickar länk..." : "Skicka inloggningslänk"}
                </Button>
              </form>

              {message && (
                <Alert className="mt-4" variant={isError ? "destructive" : "default"}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                Endast godkända medlemmar kan logga in. Om du saknar åtkomst,
                kontakta administratören.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}