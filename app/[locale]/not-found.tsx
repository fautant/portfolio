import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4">
          Page non trouvée
        </h2>
        <p className="text-text-muted dark:text-text-muted-light mb-8 max-w-md mx-auto">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
