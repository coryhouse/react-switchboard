// Get list of localStorage items that start with "sb-"
export function getLocalStorageSwitchboardKeys() {
  return Object.keys(localStorage).filter((key) => key.startsWith("sb-"));
}
