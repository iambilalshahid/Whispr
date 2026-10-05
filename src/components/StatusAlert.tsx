import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/reui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type StatusAlertVariant = "error" | "success" | "warning" | "info";

export interface StatusAlertProps {
  /** Variant indicating the nature and style of the message */
  variant?: StatusAlertVariant;
  /** Main title, defaults to capitalized variant name if omitted */
  title?: React.ReactNode;
  /** Message content or description */
  message: React.ReactNode;
  /** Callback triggered when dismiss (X) button is clicked. If not provided, close button is hidden */
  onDismiss?: () => void;
  /** Optional custom icon to override default variant icon */
  icon?: React.ReactNode;
  /** Optional additional classes for the outer Alert container */
  className?: string;
}

const variantConfig: Record<
  StatusAlertVariant,
  {
    alertVariant: "destructive" | "success" | "warning" | "info";
    defaultTitle: string;
    icon: React.ReactElement;
  }
> = {
  error: {
    alertVariant: "destructive",
    defaultTitle: "Error",
    icon: <AlertCircle className="size-3.5 sm:size-4 shrink-0 text-red-400" />,
  },
  success: {
    alertVariant: "success",
    defaultTitle: "Success",
    icon: (
      <CheckCircle2 className="size-3.5 sm:size-4 shrink-0 text-emerald-400" />
    ),
  },
  warning: {
    alertVariant: "warning",
    defaultTitle: "Warning",
    icon: (
      <AlertTriangle className="size-3.5 sm:size-4 shrink-0 text-amber-400" />
    ),
  },
  info: {
    alertVariant: "info",
    defaultTitle: "Info",
    icon: <Info className="size-3.5 sm:size-4 shrink-0 text-sky-400" />,
  },
};

export const StatusAlert: React.FC<StatusAlertProps> = ({
  variant = "info",
  title,
  message,
  onDismiss,
  icon,
  className,
}) => {
  const config = variantConfig[variant];
  const renderedTitle = title ?? config.defaultTitle;
  const renderedIcon = icon ?? config.icon;

  return (
    <Alert
      variant={config.alertVariant}
      className={cn(
        "relative mb-5 bg-black/50 border-white/10 p-2.5 sm:p-3 animate-in fade-in-50 duration-200",
        onDismiss && "pr-8 sm:pr-9",
        className
      )}
    >
      {renderedIcon}

      {renderedTitle && (
        <AlertTitle className="text-white text-[11px] sm:text-xs font-semibold leading-tight">
          {renderedTitle}
        </AlertTitle>
      )}

      <AlertDescription className="text-zinc-300 text-[11px] sm:text-xs break-words leading-relaxed">
        {message}
      </AlertDescription>

      {onDismiss && (
        <AlertAction className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 m-0 p-0">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onDismiss}
            className="rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer h-auto p-1"
            aria-label="Dismiss alert"
          >
            <X size={13} />
          </Button>
        </AlertAction>
      )}
    </Alert>
  );
};

export default StatusAlert;
