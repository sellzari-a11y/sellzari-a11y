"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab / Shift+Tab cycling inside the given elements while `active`.
 * Several roots can be passed when a dialog's controls live in more than one
 * place (e.g. a menu whose close button sits in the header).
 */
export function useFocusTrap(roots: RefObject<HTMLElement | null>[], active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = roots
        .flatMap((root) => (root.current ? Array.from(root.current.querySelectorAll<HTMLElement>(FOCUSABLE)) : []))
        .concat(roots.map((root) => root.current).filter((el): el is HTMLElement => !!el?.matches(FOCUSABLE)))
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      const inside = !!current && items.includes(current);
      if (e.shiftKey && (current === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // `roots` holds stable ref objects; re-binding on identity would be wasted work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
