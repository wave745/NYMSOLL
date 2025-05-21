import { ReactNode, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary hover:bg-primary-light text-white",
        secondary: "bg-secondary hover:bg-secondary/90 text-white",
        outline: "bg-background-lighter border border-neutral-dark/50 text-neutral-light hover:bg-background",
        gradient: "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90",
        destructive: "bg-destructive hover:bg-destructive/90 text-white",
        success: "bg-success hover:bg-success/90 text-white",
        ghost: "bg-transparent hover:bg-background-lighter text-neutral-light",
      },
      size: {
        sm: "px-3 py-1 text-sm rounded",
        md: "px-6 py-3 rounded-lg",
        lg: "px-6 py-4 rounded-xl",
        icon: "p-2 rounded-lg",
        pill: "px-4 py-2 rounded-full text-sm",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface IconTextButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: string;
  iconPosition?: "left" | "right";
  children?: ReactNode;
  className?: string;
}

export function IconTextButton({
  className,
  variant,
  size,
  fullWidth,
  icon,
  iconPosition = "left",
  children,
  ...props
}: IconTextButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <i className={`${icon} ${children ? "mr-2" : ""}`}></i>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <i className={`${icon} ${children ? "ml-2" : ""}`}></i>
      )}
    </button>
  );
}
