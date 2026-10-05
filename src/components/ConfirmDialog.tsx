import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import LatticeLoader from "@/components/LatticeLoader";

export interface ConfirmDialogProps {
  /** The trigger element that opens the dialog */
  trigger?: React.ReactElement;
  /** Dialog controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Title of the alert popup */
  title: React.ReactNode;
  /** Description or message */
  description?: React.ReactNode;
  /** Text for the confirm action button (default: "Confirm") */
  confirmText?: string;
  /** Text for the cancel button (default: "Cancel") */
  cancelText?: string;
  /** Variant style for confirm action: destructive (red) or default */
  variant?: "destructive" | "default";
  /** Handler invoked when confirm button is clicked */
  onConfirm?: () => void | Promise<void>;
  /** Handler invoked when cancel button is clicked */
  onCancel?: () => void;
  /** Custom class for content modal */
  contentClassName?: string;
  /** Loading state for confirm button */
  loading?: boolean;
  /** Additional children inside content if needed */
  children?: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  onConfirm,
  onCancel,
  contentClassName,
  loading = false,
  children,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent
        className={cn(
          "bg-zinc-950/90 backdrop-blur-xl border border-white/10 text-white rounded-2xl max-w-sm z-50",
          contentClassName
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-lg font-semibold">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-zinc-400 text-sm">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {children}

        <AlertDialogFooter className="mt-4 flex gap-2 sm:justify-end">
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-white/[0.08] hover:bg-white/[0.14] border-white/10 text-zinc-300 hover:text-white rounded-xl"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async (_) => {
              if (onConfirm) {
                await onConfirm();
              }
            }}
            disabled={loading}
            className={cn(
              "font-medium rounded-xl border-none cursor-pointer transition-all flex items-center justify-center min-w-[84px]",
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white hover:bg-zinc-200 text-zinc-950"
            )}
          >
            {loading ? (
              <LatticeLoader
                status="working"
                label="Confirming"
                doneLabel="Done in"
                errorLabel="Failed after"
                pattern="orbit"
                grid={3}
                shape="round"
                doneColor="#22c55e"
                errorColor="#ef4444"
                cellSize={4}
                gap={2}
                fontSize={12}
                step={90}
                idleOpacity={0.15}
                glow={false}
                glowColor=""
                showTimer={false}
                color={variant === "destructive" ? "#ffffff" : "#09090b"}
              />
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
