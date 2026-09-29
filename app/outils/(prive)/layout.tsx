import { requireAdmin } from "@/lib/auth/session";

// Espace privé : jamais prérendu (dépend de la session)
export const dynamic = "force-dynamic";

export default async function PriveLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
