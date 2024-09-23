import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "@/components/ui/toaster";
import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s / AnswerMyPDF",
    default: "Welcome /  AnswerMyPDF",
  },

  description:
    "pscme.online kerala is one of the best tool to assist psc aspirant to reach their dream job.Most questions are available in malayalam .Quizes,Daily cuurent affairs,Updated news on related topics are the key features",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            `min-h-screen font-sans antialiased grainy`,
            inter.className
          )}
        >
          <Toaster />
          <NavBar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
