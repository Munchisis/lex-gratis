import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LawyerSidebar } from "@/components/lawyer/LawyerSidebar";

export default async function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "lawyer") {
    redirect("/auth/login");
  }

  if (!session.user.isApproved) {
    redirect("/auth/pending");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LawyerSidebar user={session.user} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
    </div>
  );
}
