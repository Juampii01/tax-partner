import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder del paso 1: solo la base navegable. Cada pantalla se implementa en los pasos 3–5.
export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <Construction className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">This section is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
