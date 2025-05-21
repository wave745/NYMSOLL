import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ToastSuccessProps {
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function ToastSuccess({ title, message, duration = 3000, onClose }: ToastSuccessProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-background-lighter border border-success/40 rounded-xl p-4 shadow-lg flex items-start max-w-sm"
        >
          <i className="ri-checkbox-circle-fill text-success text-xl mt-0.5 mr-3"></i>
          <div>
            <h4 className="font-medium text-neutral-light mb-1">{title}</h4>
            <p className="text-neutral text-sm">{message}</p>
          </div>
          <button 
            className="ml-auto text-neutral hover:text-neutral-light" 
            onClick={handleClose}
            aria-label="Close"
          >
            <i className="ri-close-line"></i>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
