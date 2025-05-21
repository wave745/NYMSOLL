import { useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import ToastSuccess from "@/components/ui/toast-success";
import ToastError from "@/components/ui/toast-error";

interface ToastOptions {
  title: string;
  description: string;
  duration?: number;
  variant?: "default" | "success" | "destructive" | "warning";
}

interface UseToastResult {
  toast: (options: ToastOptions) => void;
}

export function useToast(): UseToastResult {
  const [toastContainer] = useState(() => {
    // Check if container already exists
    let container = document.getElementById("toast-container");
    
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2";
      document.body.appendChild(container);
    }
    
    return container;
  });

  const toast = useCallback(
    ({ title, description, duration = 3000, variant = "default" }: ToastOptions) => {
      const toastId = `toast-${Date.now()}`;
      const toastElement = document.createElement("div");
      toastElement.id = toastId;
      toastContainer.appendChild(toastElement);
      
      const root = createRoot(toastElement);
      
      const handleClose = () => {
        root.unmount();
        toastElement.remove();
      };
      
      if (variant === "success") {
        root.render(
          <ToastSuccess
            title={title}
            message={description}
            duration={duration}
            onClose={handleClose}
          />
        );
      } else if (variant === "destructive") {
        root.render(
          <ToastError
            title={title}
            message={description}
            duration={duration}
            onClose={handleClose}
          />
        );
      } else {
        // Default toast or other variants
        root.render(
          <ToastSuccess
            title={title}
            message={description}
            duration={duration}
            onClose={handleClose}
          />
        );
      }
    },
    [toastContainer]
  );

  return { toast };
}
