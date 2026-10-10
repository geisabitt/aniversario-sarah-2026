import type { Metadata } from "next";
import "./globals.css";
import { convite } from "../config/convite";

export const metadata: Metadata = {
  title: convite.evento.titulo,
  description: convite.evento.subtitulo,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
