import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function Profile() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold font-display">Be an artist</h1>
    </div>
  );
}
