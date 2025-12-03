import "./globals.css";


export const metadata = {
  title: "IronArena",
  description: "IronArena Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-screen overflow-hidden">
        <main className="flex-1 h-full w-full overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
