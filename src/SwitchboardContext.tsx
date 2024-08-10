import React from "react";
import { useSwitchboardState } from "./useSwitchboardState";
import { SwitchboardDefaults } from "./switchboard.types";

const SwitchboardContext = React.createContext<any | null>(null);

type SwitchboardContextProviderProps = {
  children: React.ReactNode;
  defaults?: any;
};

export function SwitchboardContextProvider({
  children,
  defaults,
}: SwitchboardContextProviderProps) {
  const [state, setState] = useSwitchboardState("switchboard", defaults);
  return (
    <SwitchboardContext.Provider value={{ state, setState, defaults }}>
      {children}
    </SwitchboardContext.Provider>
  );
}

/** Read and set SwitchboardContext state */
export function useSwitchboardContext<T>() {
  const context = React.useContext(SwitchboardContext);
  if (!context) {
    throw new Error(
      "useSwitchboardContext must be used within a SwitchboardContextProvider"
    );
  }

  return [
    context.state as T,
    context.setState as (newState: T) => void,
  ] as const;
}
