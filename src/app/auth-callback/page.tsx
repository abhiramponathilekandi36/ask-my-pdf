import AuthCallback from "@/components/AuthCallback";
import { Suspense } from "react";

const Page = () => {
  return (
    <main>
      <Suspense>
        <AuthCallback />
      </Suspense>
    </main>
  );
};

export default Page;
