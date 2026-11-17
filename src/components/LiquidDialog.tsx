import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { closeTopLayer, installClosedByFallback } from '../utils/platform';

interface LiquidDialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  closeLabel: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export const LiquidDialog: React.FC<LiquidDialogProps> = ({
  open,
  onClose,
  titleId,
  title,
  closeLabel,
  subtitle,
  className = '',
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const cleanupFallback = installClosedByFallback(dialog);

    const onCancel = (e: Event) => {
      e.preventDefault();
      void closeTopLayer(dialog);
    };

    const onNativeClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('cancel', onCancel);
    dialog.addEventListener('close', onNativeClose);
    return () => {
      cleanupFallback();
      dialog.removeEventListener('cancel', onCancel);
      dialog.removeEventListener('close', onNativeClose);
    };
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      void closeTopLayer(dialog);
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={`liquid-dialog ${className}`.trim()}
      {...({ closedby: 'any' } as Record<string, string>)}
    >
      <div className="liquid-dialog-shell">
        <header className="liquid-dialog-header">
          <div className="liquid-dialog-heading-group">
            <h2 id={titleId} className="liquid-dialog-title">
              {title}
            </h2>
            {subtitle ? <p className="liquid-dialog-subtitle">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            className="liquid-dialog-close"
            aria-label={closeLabel}
            onClick={() => {
              void closeTopLayer(dialogRef.current);
            }}
          >
            <X size={18} aria-hidden="true" />
            <span className="visually-hidden">{closeLabel}</span>
          </button>
        </header>
        <div className="liquid-dialog-body">{children}</div>
      </div>
    </dialog>
  );
};
