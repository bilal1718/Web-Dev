// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import LayoutWrapper from './LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EduConnect | Modern Learning Platform',
  description: 'An AI-powered education platform connecting teachers and students worldwide',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
