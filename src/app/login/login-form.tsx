"use client";

import { useActionState } from "react";
import { MailCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState);

  if (state.status === "sent") {
    return (
      <div className="space-y-4 text-center" role="status">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary">
          <MailCheck className="size-7 text-brand-navy" aria-hidden />
        </div>
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-muted-foreground">
          If <span className="font-medium text-foreground">{state.email}</span> is registered
          as a GovBidder Tax Partner, you&apos;ll receive a sign-in link in a few seconds.
        </p>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t get it? Check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {linkError && state.status === "idle" && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          That sign-in link is invalid or has expired. Request a new one below.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@yourcompany.com"
          required
          // React 19 resetea el form tras la action: conservamos lo que escribió.
          defaultValue={state.status === "error" ? state.email : undefined}
          className="h-12 text-base"
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? "email-error" : undefined}
        />
        {state.status === "error" && (
          <p id="email-error" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden /> Sending link…
          </>
        ) : (
          "Email me a sign-in link"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        No password needed. We&apos;ll email you a secure link.
      </p>
    </form>
  );
}
