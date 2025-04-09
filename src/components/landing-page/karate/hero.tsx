import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import karateDoAsset from '@/assets/images/karatedo-carousel.png';

export const HeroSection = () => {
  return (
    <section className="relative">
      <div className="relative h-[400px]">
        <Image
          src={karateDoAsset}
          alt="Karate-Do Training"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white">
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center text-white hover:text-yellow-500 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Voltar</span>
        </Link>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Karate-Do</h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8">
            O caminho das mãos vazias: disciplina, técnica e filosofia
        </p>
      </div>
    </section>
  );
}