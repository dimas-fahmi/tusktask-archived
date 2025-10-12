import type React from "react";

const AuthLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <div className="layout-width flex items-center justify-center h-dvh overflow-y-scroll scrollbar-none">
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
