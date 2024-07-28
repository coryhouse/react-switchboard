// Write the provided string to the clipboard
export async function writeToClipboard(content: string) {
  const type = "text/plain";
  const blob = new Blob([content], {
    type,
  });
  const data = [new ClipboardItem({ [type]: blob })];
  return navigator.clipboard.write(data);
}
