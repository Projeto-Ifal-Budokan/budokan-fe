import karateDoAsset from '@/assets/images/karate-do.png';
import Image from 'next/image';

export const AboutSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                <h2 className="text-3xl font-bold text-blue-800 mb-4">O Que é Karate-Do?</h2>
                <div className="w-20 h-1 bg-yellow-500 mb-6"></div>
                <p className="text-gray-600 mb-4">
                    Karate-Do, ou "O Caminho das Mãos Vazias", é uma arte marcial japonesa que se originou em Okinawa e
                    foi posteriormente desenvolvida no Japão. É caracterizada por golpes lineares, bloqueios e chutes,
                    utilizando todas as partes do corpo como armas naturais para defesa pessoal.
                </p>
                <p className="text-gray-600 mb-4">
                    Na Budokan-Ryu, praticamos o estilo Shotokan, um dos mais tradicionais e difundidos no mundo. Nossa
                    abordagem enfatiza não apenas a técnica física, mas também o desenvolvimento do caráter, disciplina e
                    respeito, seguindo o verdadeiro espírito do Karate-Do.
                </p>
                <p className="text-gray-600">
                    O treinamento de Karate-Do na Budokan-Ryu é adequado para pessoas de todas as idades e níveis de
                    condicionamento físico, proporcionando benefícios que vão muito além da defesa pessoal.
                </p>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                    src={karateDoAsset}
                    alt="Karate Training"
                    fill
                    className="object-cover object-[center_15%]"
                />
                </div>
            </div>
            </div>
        </section>
    );
}