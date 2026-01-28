"use client";

import { createContext, useContext, useState } from "react";
import { ConfirmDialog } from "./common/ConfirmDialog";

type ConfirmOptions = {
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(opts);
      setResolver(() => resolve);
    });
  };

  const handleClose = () => {
    setOptions(null);
    resolver?.(false);
    setResolver(null);
  };

  const handleConfirm = () => {
    setOptions(null);
    resolver?.(true);
    setResolver(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <ConfirmDialog
        open={!!options}
        onOpenChange={(open) => !open && handleClose()}
        title={options?.title}
        description={options?.description}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        destructive={options?.destructive}
        onConfirm={handleConfirm}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }
  return ctx.confirm;
}
