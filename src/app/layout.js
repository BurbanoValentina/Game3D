import '../styles/globals.css';

export const metadata = {
  title: 'OASIS — La Última Clave',
  description: 'Las 5 Llaves de Halliday. Juego 3D cyberpunk narrativo.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-oasis-cream text-oasis-dark antialiased">
        {children}
      </body>
    </html>
  );
}
