import { Sidebar } from "@/components/outils/Sidebar";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="o-shell">
      <Sidebar />
      <main className="o-main">
        <div className="o-wrap">{children}</div>
      </main>
    </div>
  );
}
