import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPost, logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  // Fetch user data from the "users" table based on the authenticated user's ID
  const { data: tableUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user?.id)
    .single();

  console.log("User data:", data.user); // Log user data for debugging
  console.log("Table user data:", tableUser); // Log table user data for debugging

  if (!data.user) {
    redirect("/login");
  }

  const isUserAdmin = tableUser?.role === "admin";

  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold">Intärn Portal Skyttemusikkåren</h1>
      <p className="mt-4">Välkommen {data.user.email}</p>

      <form action={createPost} className="mt-6">
        {isUserAdmin && (
          <button
            type="submit"
            className="bg-black px-4 py-2 text-white rounded-xl"
          >
            Ny inlägg
          </button>
        )}
      </form>

      <form action={logout} className="mt-6">
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Log out
        </button>
      </form>
    </main>
  );
}
