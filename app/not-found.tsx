import Link from 'next/link';
import Image from 'next/image';
import { BiArrowBack } from 'react-icons/bi';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-4 py-[150px]">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo or Brand Image */}
        <div className="mx-auto w-32 h-32 relative mb-4">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            fill 
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-6xl font-bold text-text">404</h1>
        <h2 className="text-2xl font-medium text-text">Pagina niet gevonden</h2>
        
        <p className="text-text/70">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        
        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-accent text-text px-6 py-3 rounded-[50px] hover:bg-accent/70 transition-colors"
          >
            <BiArrowBack />
            <span>Terug naar homepagina</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 