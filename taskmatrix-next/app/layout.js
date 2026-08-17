import "./globals.css";
import StoreProvider from "../components/StoreProvider";

export const metadata = {
  title: "TaskMatrix | Agile Project Management",
  description:
    "TaskMatrix - Enterprise Agile Project Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}