export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex justify-center gap-12">{children}</div>;
}
