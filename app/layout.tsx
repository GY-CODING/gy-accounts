import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { lexendFont, valorantFont } from "./utils/fonts";

export const metadata: Metadata = {
  title: "GY Accounts - Dashboard",
  description: "Manage your GYCoding account settings and preferences",
  icons: {
    icon: "/gycoding-ico.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexendFont.variable} ${valorantFont.variable} font-sans min-h-screen antialiased`}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
