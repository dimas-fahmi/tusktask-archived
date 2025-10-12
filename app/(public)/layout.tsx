import PublicNavBar from "@/src/ui/components/NavBar/public";
import PublicSidebar from "@/src/ui/components/NavBar/public/Sidebar";

const PublicLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <>
      {/* Public NavBar */}
      <PublicNavBar />

      {/* Children */}
      <main>{children}</main>

      {/* Public Footer */}
      <footer>Footer</footer>

      {/* Sidebars */}
      <PublicSidebar />
    </>
  );
};

export default PublicLayout;
