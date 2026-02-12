import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönlendirme",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

const CallbackLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default CallbackLayout;
