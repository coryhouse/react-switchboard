import { useCallback, useState } from "react";

/** Returns a string that contains the current URL with the specified key and value in the querystring */
function getUrlWithUpdatedQuery(url: URL, key: string, value: unknown = null) {
  const urlWithoutQuerystring = url.href.split("?")[0];
  const params = new URLSearchParams(url.search);
  // Remove existing querystring if it exists. Here's why:
  // 1. This assures the newly generated URL doesn't contain the param twice.
  // 2. We only add the param if a value is provided,
  // so removing it cleans up the URL if no value has been provided for the key.
  params.delete(key);
  if (value) params.append(key, JSON.stringify(value));
  return urlWithoutQuerystring + "?" + params.toString();
}

export type DevToolsStateOptions = {
  /** Set to true to show values that match the default value in the URL.
   * By default, if the selected value matches the default value, it's omitted from the URL.
   * This keeps the URL as short as possible.  */
  // TODO: Finish refactor to union
  urlBehavior?: "initialization-only" | "initialize-and-display-always";

  /** Set to true to store values that match the default value in localStorage.
   * By default, if the selected value matches the default value, it's omitted from localStorage.
   * This keeps localStorage as minimal as possible.
   */
  storeDefaultValuesInLocalStorage?: boolean;
};

/**
 * This hook makes it easy to declare state for devtools.
 * It's a fork of https://usehooks.com/useLocalStorage/,
 * // TODO: Consider forking alternative localStorage hook that uses useSyncExternalStore
 * but enhanced to read the URL as a way to override the specified default.
 * Since devtools often benefit from being initialized via the URL,
 * it reads the default value from the URL. And since it's handy
 * for the DevTools to "remember" settings between hard refreshes,
 * it writes settings to localStorage onChange.
 *
 * Finally, if neither the URL or localStorage is set, it falls back
 * to the provided default.
 * It sets the default value in the following order:
 * 1. URL
 * 2. localStorage
 * 3. Specified default
 *
 * So, in other words, if the URL isn't provided, it falls back to localStorage.
 * If localStorage isn't set, it falls back to the specified default.
 *
 * This hook writes each state change to 2 spots:
 * 1. localStorage (so settings persist after the tab is closed)
 * 2. local state variable (so React re-renders the devtools)
 *
 *
 * @param key The URL param to check for the default, as well as the key used to write the value to localStorage
 * @param defaultValue The default value to use if the URL and localStorage both don't have a matching value for the provided key.
 * */
export function useSwitchboardState<T>(
  key: string,
  defaultValue: T,
  options?: DevToolsStateOptions
) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    // First, check the URL for a value and use it for the default if found.
    const params = new URLSearchParams(window.location.search);
    const urlValue = params.get(key);
    if (urlValue) {
      // TODO: Validate the object
      const parsedObject = JSON.parse(urlValue);
      // Update localStorage with URL value too
      // TODO: Use localforage instead.
      window.localStorage.setItem(key, JSON.stringify(parsedObject));

      // Clear out the URL now that we read the value and stored it in localStorage. This keeps the URL clean.
      // TODO: Make this an option
      const newUrl = getUrlWithUpdatedQuery(new URL(window.location.href), key);
      window.history.pushState("", "DevTools state update", newUrl);

      return parsedObject;
    }

    // If URL doesn't contain the key, then fall back to checking localStorage for a default value
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue

      // TODO: Use Zod to assure the querystring parses into a DevToolsConfig
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return defaultValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Step 1: Save state, so React re-renders
        setStoredValue(valueToStore);

        // Step 2: Save to localStorage, so the settings persist after the window is closed
        if (typeof window !== "undefined") {
          // If the value is the initial value, then we can omit it from localStorage.
          // But, go ahead and put it in localStorage anyway if storeDefaultValuesInLocalStorage is true.
          if (
            valueToStore == defaultValue &&
            !options?.storeDefaultValuesInLocalStorage
          ) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        }
      } catch (error) {
        // TODO: Improve error handling
        console.error(error);
      }
    },
    [defaultValue, key, options?.storeDefaultValuesInLocalStorage, storedValue]
  );

  const isChanged = storedValue !== defaultValue;

  return [storedValue, setValue, isChanged] as const;
}
