import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import AuthModal from "@/components/AuthModal";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";
import { fetchAuthUser, fetchProducts, getProjectByDomain } from "@/utils/auth";
import PricesModal from "@/components/PricesModal";
import { headers } from "next/headers";
import { isAipage } from "@/utils/helpers";
import HTMLPreview from "@/components/HTMLPreview";
import { Project } from "@/types";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIPage.dev - An AI-Powered Landing Page Generator | by @zinedkaloc",
  description:
    "AI-Powered Landing Page Generator. Experience the Open Source Project that Empowers You to Build Stunning Landing Pages Instantly",
  openGraph: {
    title: "AIPage.dev - An AI-Powered Landing Page Generator | by @zinedkaloc",
    description:
      "AI-Powered Landing Page Generator. Experience the Open Source Project that Empowers You to Build Stunning Landing Pages Instantly",
    type: "website",
    url: "https://aipage.dev",
    images: `${process.env.NEXT_PUBLIC_DOMAIN}/api/og?text=${new Date()
      .getTime()
      .toString()}`,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await fetchAuthUser();
  const products = await fetchProducts();
  const isAipageDomain = isAipage(headers().get("Host") as string);
  let project: Project | null = null;

  if (!isAipageDomain)
    project = await getProjectByDomain(headers().get("Host") as string);

  if (isAipageDomain || !project) {
    return (
      <AuthProvider user={user ?? null}>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <AuthModal />
            <PricesModal products={products} />
          </body>
        </html>
      </AuthProvider>
    );
  }

  return <HTMLPreview html={project.result} id={project._id} />;
}
