import * as React from "react";

/** Close only when pointer down and up both occur on the overlay (not drag-out). */
export function useOverlayDismiss(onDismiss: () => void) {
  const pointerDownOnOverlay = React.useRef(false);

  const overlayProps = {
    onMouseDown: (e: React.MouseEvent) => {
      pointerDownOnOverlay.current = e.target === e.currentTarget;
    },
    onClick: (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && pointerDownOnOverlay.current) {
        onDismiss();
      }
      pointerDownOnOverlay.current = false;
    },
  };

  return { overlayProps };
}

/** For separate backdrop + panel layouts (e.g. slide-in sheets). */
export function useBackdropDismiss(onDismiss: () => void) {
  const pointerDownOnBackdrop = React.useRef(false);

  const backdropProps = {
    onMouseDown: () => {
      pointerDownOnBackdrop.current = true;
    },
    onClick: () => {
      if (pointerDownOnBackdrop.current) {
        onDismiss();
      }
      pointerDownOnBackdrop.current = false;
    },
  };

  const cancelBackdropDismiss = () => {
    pointerDownOnBackdrop.current = false;
  };

  return { backdropProps, cancelBackdropDismiss };
}
