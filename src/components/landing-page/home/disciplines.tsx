import arqueariaAsset from '@/assets/images/archery-discipline.jpeg';
import karateAsset from '@/assets/images/karate-discipline.jpeg';
import kendoAsset from '@/assets/images/kendo-discipline.jpeg';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const DisciplinesSection = () => {
  return (
    <section id='disciplines' className='bg-blue-50 py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>
            Nossas Modalidades
          </h2>
          <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>
            Conheça as artes marciais tradicionais japonesas ensinadas na
            Budokan-Ryu, cada uma com sua história, filosofia e técnicas únicas.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <div className='overflow-hidden rounded-lg bg-white shadow-md'>
            <div className='relative h-80'>
              <Image
                src={karateAsset.src}
                alt='Karate-Do'
                fill
                className='object-cover object-top'
              />
            </div>
            <div className='p-6'>
              <h3 className='mb-2 text-xl font-bold text-blue-900'>
                Karate-Do
              </h3>
              <p className='mb-4 text-gray-600'>
                O &quot;Caminho das Mãos Vazias&quot; é uma arte marcial que
                desenvolve técnicas de golpes, bloqueios e chutes. Além do
                aspecto físico, o Karate-Do promove disciplina, respeito e
                autocontrole.
              </p>
              <Link href='/karate'>
                <Button className='bg-primary hover:bg-primary/90 w-full border-0 text-white'>
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>

          <div className='overflow-hidden rounded-lg bg-white shadow-md'>
            <div className='relative h-80'>
              <Image
                src={kendoAsset.src}
                alt='Kendo'
                fill
                className='object-cover object-top'
              />
            </div>
            <div className='p-6'>
              <h3 className='mb-2 text-xl font-bold text-blue-900'>Kendo</h3>
              <p className='mb-4 text-gray-600'>
                A &quot;Via da Espada&quot; é a arte marcial dos samurais,
                praticada com espadas de bambu e armaduras protetoras. O Kendo
                desenvolve força, velocidade, precisão e um espírito forte.
              </p>
              <Link href='/kendo'>
                <Button className='bg-primary hover:bg-primary/90 w-full border-0 text-white'>
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>

          <div className='overflow-hidden rounded-lg bg-white shadow-md'>
            <div className='relative h-80'>
              <Image
                src={arqueariaAsset.src}
                alt='Arquearia'
                fill
                className='object-cover object-top'
              />
            </div>
            <div className='p-6'>
              <h3 className='mb-2 text-xl font-bold text-blue-900'>
                Arquearia
              </h3>
              <p className='mb-4 text-gray-600'>
                O &quot;Caminho do Arco&quot; é uma arte marcial que utiliza
                arco e flecha, focando na precisão, concentração e harmonia
                entre corpo e mente. É considerado uma forma de meditação em
                movimento.
              </p>
              <Link href='/archery'>
                <Button className='bg-primary hover:bg-primary/90 w-full border-0 text-white'>
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
