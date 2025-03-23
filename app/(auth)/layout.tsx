import { Gabarito } from "next/font/google";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const gabarito = Gabarito({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {children}
    </div>
  );
} 