import { useRouteError } from "react-router-dom";
import "../App.css";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div class="grid h-screen px-4 bg-white place-content-center">
      <div class="text-center">
        <h1 class="font-black text-gray-200 text-9xl">404</h1>

        <p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>

        <p class="mt-4 text-gray-500">We can't find that page.</p>
      </div>
    </div>
  );
}