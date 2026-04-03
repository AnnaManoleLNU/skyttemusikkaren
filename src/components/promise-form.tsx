"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  action: (formData: FormData) => Promise<unknown>;
  children: React.ReactNode;
  loading: string;
  success: string;
  error: string;
  className?: string;
  onSuccess?: () => void;
};

export function PromiseForm({
  action,
  children,
  loading,
  success,
  error,
  className,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        startTransition(() => {
          toast.promise(action(formData), {
            loading,
            success: () => {
              form.reset();
              router.refresh();
              onSuccess?.();
              return success;
            },
            error: (err) => {
              return err instanceof Error ? err.message : error;
            },
          });
        });
      }}
    >
      {children}
    </form>
  );
}