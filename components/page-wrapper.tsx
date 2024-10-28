import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col pt-2 px-1 space-y-2 bg-gray-200 flex-grow pb-4">
      {children}
    </div>
  );
}