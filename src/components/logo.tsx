import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../../public/fonts/font.woff2",
});

const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="logo" height={30} width={30} />
        <p className={cn("text-lg text-neutral-700 pb-1", headingFont.className)}>Trello Clone</p>
      </div>
    </Link>
  );
};

export { Logo };
