import './globals.css';
import { Providers } from './providers';
import '@rainbow-me/rainbowkit/styles.css';

export const metadata = { 
  title: 'MinaPools — Halal DeFi Dashboard' 
};

export default function DAppLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}