import React, { useEffect } from "react";

/**
 * Call a function when the user clicks outside the ref passed.
 * @param ref Clicks outside this element will trigger the function provided to onOutsideClick
 * @param onOutsideClick Function called when the user clicks outside the element specified in the ref argument
 * @returns void
 */
export default function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  onOutsideClick: (event: globalThis.MouseEvent) => void
) {
  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        onOutsideClick(event);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
}
