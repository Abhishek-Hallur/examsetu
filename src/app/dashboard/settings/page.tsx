import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PasswordForm } from "@/components/dashboard/password-form";

export const metadata: Metadata = { title: "Settings · Dashboard" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/settings");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, passwordHash: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and security preferences.
        </p>
      </div>

      <ProfileForm name={user.name ?? ""} email={user.email} />
      <PasswordForm hasPassword={!!user.passwordHash} />
    </div>
  );
}
