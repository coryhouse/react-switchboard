import { FallbackProps } from "react-error-boundary";
import Button from "./components/Button";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: Readonly<FallbackProps>) {
  return (
    <div role="alert" className="grid h-screen place-content-center">
      <h1 className="font-bold text-xl">Something went wrong.</h1>
      <pre>{error.message}</pre>
      <Button
        className="bg-blue-600 text-white mt-4"
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </div>
  );
}
