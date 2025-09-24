import React from "react";

const PublicLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <>
      {/* Public NavBar */}
      <nav>Navbar</nav>

      {/* Children */}
      <main>{children}</main>

      {/* Public Footer */}
      <footer>Footer</footer>
    </>
  );
};

export default PublicLayout;
