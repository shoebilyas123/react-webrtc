import React, { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full relative h-[100vh] bg-neutral-900 flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
