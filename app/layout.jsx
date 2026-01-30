import React from "react";
import "./globals.css";

export const metadata = {
  title: "Admission Management ERP",
  description: "Professional Admission Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
