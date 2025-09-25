import React from "react";

const AuthLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default AuthLayout;
