import "./globals.css";
import ScaffoldWithProvider from "../components/ScaffoldWithProvider";
import { getMetadata } from "@/utils/getMetaData";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = getMetadata({
  title: "Defi Analytics App",
  description: "Built with The Graph",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider enableSystem>
          <ScaffoldWithProvider>{children}</ScaffoldWithProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
