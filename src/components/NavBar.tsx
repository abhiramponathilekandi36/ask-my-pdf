import Link from "next/link";
import MaxWidthWarapper from "./MaxWidthWrapper";
import { PROJECT_NAME } from "@/constants/project-meta";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWarapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="flex z-40 font-semibold">
            <span>{PROJECT_NAME}.</span>
          </Link>

          {/* todo:add mobiole navbar */}
          <div className="hidden items-center space-z-4 sm:flex">
            <>
              <Link
                className={buttonVariants({ variant: "ghost", size: "sm" })}
                href={"/pricing"}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </LoginLink>
              <RegisterLink className={buttonVariants({ size: "sm" })}>
                Get started <ArrowRight className="ml-1.5 h-5 w-5" />
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWarapper>
    </nav>
  );
};

export default NavBar;
