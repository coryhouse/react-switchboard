// Get list of localStorage items that start with "sb-"
function getLocalStorageSwitchboardKeys() {
  return Object.keys(localStorage).filter((key) => key.startsWith("sb-"));
}
