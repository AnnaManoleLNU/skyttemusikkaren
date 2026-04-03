import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold">Members area</h1>
      <p className="mt-4">Signed in as {data.user.email}</p>
    </main>
  );
}