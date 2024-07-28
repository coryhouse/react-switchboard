// TODO: Remove this when types are provided. Pull from https://github.com/jacobbuck/react-use-keypress/issues/6#issue-1319821201
declare module "react-use-keypress" {
  export default function useKeyPress(
    key: KeyboardEvent["key"] | KeyboardEvent["key"][],
    callback?: (e: KeyboardEvent) => void
  );
}
