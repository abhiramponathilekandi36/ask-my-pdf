"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, error, isLoading, isSuccess } = trpc.authCallback.useQuery(
    undefined
  );

  // console.log(error, "error");
  // console.log(data, "data");

  useEffect(() => {
    if (isSuccess && data.success) {
      // user is synced to db
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [isSuccess, data, origin, router]);

  useEffect(() => {
    if (error?.data?.code === "UNAUTHORIZED") {
      router.push("/");
    }
  }, [error, router]);

  // Handle success
  // if (isSuccess && data?.success) {
  //   console.log(data.success);
  //   router.push(origin ? `/${origin}` : "/dashboard");
  // }

  // // Handle error
  // if (error?.data?.code === "UNAUTHORIZED") {
  //   router.push("/sign-in");
  // }

  if (isLoading)
    return (
      <Suspense>
        <div className="w-full mt-24 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
            <h3 className="font-semibold text-xl">
              Setting up your account...
            </h3>
            <p>You will be redirected automatically.</p>
          </div>
        </div>
      </Suspense>
    );
};

export default Page;
