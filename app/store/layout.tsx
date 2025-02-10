import Navbar from "@/components/shared/Navbar";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar isPublic={true} />
      {children}
    </main>
  );
}
