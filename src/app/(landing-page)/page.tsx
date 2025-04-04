import HeroCarousel from '@/components/hero-carousel';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

import karateAsset from '@/assets/images/karate-do.png';
import kendoAsset from '@/assets/images/kendo.png';
import kyudoAsset from '@/assets/images/kyudo.png';

export default function Home() {
  return (
    <div className=''>
      {/* Hero Section with Carousel */}
      <HeroCarousel />

      {/* About Section */}
      <section id='about' className='bg-white py-16'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-blue-900'>
              Sobre a Budokan
            </h2>
            <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
            <p className='mx-auto max-w-3xl text-gray-600'>
              Há mais de 30 anos formando campeões e transformando vidas através
              das artes marciais tradicionais japonesas.
            </p>
          </div>

          <div className='grid items-center gap-12 md:grid-cols-2'>
            <div className='relative h-[400px] overflow-hidden rounded-lg shadow-lg'>
              <Image
                src='/placeholder.svg?height=400&width=600'
                alt='Budokan Dojo'
                fill
                className='object-cover'
              />
            </div>
            <div>
              <h3 className='mb-4 text-2xl font-bold text-blue-900'>
                Nossa História
              </h3>
              <p className='mb-4 text-gray-600'>
                Fundada em 1985 pelo Sensei Tanaka, a Associação de Artes
                Marciais Budokan nasceu com o objetivo de preservar e difundir
                as artes marciais tradicionais japonesas no Brasil, mantendo sua
                essência, filosofia e técnicas.
              </p>
              <p className='mb-4 text-gray-600'>
                Ao longo de mais de três décadas, a Budokan se consolidou como
                uma referência no ensino de Karate-Do, Kendo e Kyudo (Tiro com
                Arco), formando não apenas atletas de alto rendimento, mas
                cidadãos íntegros e disciplinados.
              </p>
              <p className='text-gray-600'>
                Nossa escola já formou diversos campeões em competições
                nacionais e internacionais, mas nosso maior orgulho está em ver
                a transformação pessoal de cada aluno que passa por nossas
                portas, independente de idade ou objetivos.
              </p>
            </div>
          </div>

          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-white'
                >
                  <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
                  <path d='m9 12 2 2 4-4' />
                </svg>
              </div>
              <h4 className='mb-2 text-xl font-bold text-blue-900'>Missão</h4>
              <p className='text-gray-600'>
                Promover o desenvolvimento físico, mental e espiritual através
                do ensino de artes marciais tradicionais, formando praticantes
                técnicos e cidadãos éticos.
              </p>
            </div>

            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-white'
                >
                  <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
                  <circle cx='12' cy='12' r='3' />
                </svg>
              </div>
              <h4 className='mb-2 text-xl font-bold text-blue-900'>Visão</h4>
              <p className='text-gray-600'>
                Ser reconhecida como referência nacional no ensino de artes
                marciais japonesas, preservando suas tradições e valores
                enquanto formamos gerações de praticantes.
              </p>
            </div>

            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-white'
                >
                  <path d='M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z' />
                </svg>
              </div>
              <h4 className='mb-2 text-xl font-bold text-blue-900'>Valores</h4>
              <p className='text-gray-600'>
                Respeito, disciplina, perseverança, integridade e excelência
                técnica são os pilares que sustentam nossa filosofia de ensino e
                convivência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section id='disciplines' className='bg-blue-50 py-16'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-blue-900'>
              Nossas Modalidades
            </h2>
            <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
            <p className='mx-auto max-w-3xl text-gray-600'>
              Conheça as artes marciais tradicionais japonesas ensinadas na
              Budokan, cada uma com sua história, filosofia e técnicas únicas.
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
                  O "Caminho das Mãos Vazias" é uma arte marcial que desenvolve
                  técnicas de golpes, bloqueios e chutes. Além do aspecto
                  físico, o Karate-Do promove disciplina, respeito e
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
                  A "Via da Espada" é a arte marcial dos samurais, praticada com
                  espadas de bambu e armaduras protetoras. O Kendo desenvolve
                  força, velocidade, precisão e um espírito forte.
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
                  src={kyudoAsset.src}
                  alt='Kyudo (Tiro com Arco)'
                  fill
                  className='object-cover object-top'
                />
              </div>
              <div className='p-6'>
                <h3 className='mb-2 text-xl font-bold text-blue-900'>
                  Kyudo (Tiro com Arco)
                </h3>
                <p className='mb-4 text-gray-600'>
                  O "Caminho do Arco" é uma arte marcial que utiliza arco e
                  flecha, focando na precisão, concentração e harmonia entre
                  corpo e mente. É considerado uma forma de meditação em
                  movimento.
                </p>
                <Link href='/kyudo'>
                  <Button className='bg-primary hover:bg-primary/90 w-full border-0 text-white'>
                    Saiba Mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id='instructors' className='bg-white py-16'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-blue-900'>
              Nossos Senseis
            </h2>
            <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
            <p className='mx-auto max-w-3xl text-gray-600'>
              Conheça os mestres que dedicam suas vidas à preservação e ao
              ensino das artes marciais tradicionais japonesas.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <div className='relative mx-auto mb-4 h-32 w-32'>
                <Image
                  src='/placeholder.svg?height=150&width=150'
                  alt='Sensei Tanaka'
                  fill
                  className='rounded-full object-cover'
                />
              </div>
              <h3 className='mb-1 text-xl font-bold text-blue-900'>
                Sensei Tanaka
              </h3>
              <p className='text-primary mb-3 font-medium'>
                Karate-Do - 7º Dan
              </p>
              <p className='text-gray-600'>
                Fundador da Budokan, treina Karate há mais de 40 anos. Formado
                diretamente pelos grandes mestres japoneses, é reconhecido
                internacionalmente por sua técnica e dedicação ao ensino.
              </p>
            </div>

            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <div className='relative mx-auto mb-4 h-32 w-32'>
                <Image
                  src='/placeholder.svg?height=150&width=150'
                  alt='Sensei Yamamoto'
                  fill
                  className='rounded-full object-cover'
                />
              </div>
              <h3 className='mb-1 text-xl font-bold text-blue-900'>
                Sensei Yamamoto
              </h3>
              <p className='text-primary mb-3 font-medium'>Kendo - 5º Dan</p>
              <p className='text-gray-600'>
                Com mais de 25 anos de experiência, é responsável pela divisão
                de Kendo da Budokan. Participou de diversos campeonatos mundiais
                e é referência na formação de novos kendokas.
              </p>
            </div>

            <div className='rounded-lg bg-blue-50 p-6 text-center'>
              <div className='relative mx-auto mb-4 h-32 w-32'>
                <Image
                  src='/placeholder.svg?height=150&width=150'
                  alt='Sensei Sato'
                  fill
                  className='rounded-full object-cover'
                />
              </div>
              <h3 className='mb-1 text-xl font-bold text-blue-900'>
                Sensei Sato
              </h3>
              <p className='text-primary mb-3 font-medium'>Kyudo - 6º Dan</p>
              <p className='text-gray-600'>
                Especialista em Kyudo, treinou por mais de 15 anos no Japão
                antes de retornar ao Brasil para difundir esta arte milenar. É
                reconhecido por sua precisão técnica e profundo conhecimento
                filosófico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id='schedule' className='bg-blue-900 py-16 text-white'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold'>Horários de Aulas</h2>
            <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
            <p className='mx-auto max-w-3xl opacity-80'>
              Oferecemos horários flexíveis para atender às necessidades de
              nossos alunos, com turmas para diferentes níveis e faixas etárias.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            <div className='rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
              <h3 className='text-primary mb-4 text-xl font-bold'>Karate-Do</h3>
              <ul className='space-y-4'>
                <li className='flex justify-between'>
                  <span>Segunda, Quarta e Sexta</span>
                  <span>17:00 - 18:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Segunda, Quarta e Sexta</span>
                  <span>18:00 - 19:30</span>
                </li>
                <li className='flex justify-between'>
                  <span>Segunda, Quarta e Sexta</span>
                  <span>19:30 - 21:00</span>
                </li>
              </ul>
              <div className='mt-6 border-t border-white/20 pt-4'>
                <h4 className='mb-2 font-medium'>Níveis</h4>
                <div className='flex flex-wrap gap-2'>
                  <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                    Infantil
                  </span>
                  <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                    Juvenil
                  </span>
                  <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                    Adulto
                  </span>
                </div>
              </div>
            </div>

            <div className='rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
              <h3 className='text-primary mb-4 text-xl font-bold'>Kendo</h3>
              <ul className='space-y-4'>
                <li className='flex justify-between'>
                  <span>Terça e Quinta</span>
                  <span>18:00 - 19:30</span>
                </li>
                <li className='flex justify-between'>
                  <span>Terça e Quinta</span>
                  <span>19:30 - 21:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Sábado</span>
                  <span>10:00 - 12:00</span>
                </li>
              </ul>
              <div className='mt-6 border-t border-white/20 pt-4'>
                <h4 className='mb-2 font-medium'>Níveis</h4>
                <div className='flex flex-wrap gap-2'>
                  <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                    Iniciantes
                  </span>
                  <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                    Intermediários
                  </span>
                  <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                    Avançados
                  </span>
                </div>
              </div>
            </div>

            <div className='rounded-lg bg-white/10 p-6 backdrop-blur-sm'>
              <h3 className='text-primary mb-4 text-xl font-bold'>
                Kyudo (Tiro com Arco)
              </h3>
              <ul className='space-y-4'>
                <li className='flex justify-between'>
                  <span>Sábado</span>
                  <span>09:00 - 12:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Domingo</span>
                  <span>09:00 - 12:00</span>
                </li>
                <li className='flex justify-between'>
                  <span>Quarta-feira</span>
                  <span>19:00 - 21:00</span>
                </li>
              </ul>
              <div className='mt-6 border-t border-white/20 pt-4'>
                <h4 className='mb-2 font-medium'>Níveis</h4>
                <div className='flex flex-wrap gap-2'>
                  <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                    Iniciantes
                  </span>
                  <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>
                    Intermediários
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-12 text-center'>
            <p className='mb-6 opacity-80'>
              Interessado em começar? Agende uma aula experimental gratuita!
            </p>
            <Button className='bg-primary hover:bg-primary/90/80 border-0 px-8 py-6 text-lg font-bold text-white'>
              Agendar Aula Experimental
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='bg-white py-16'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-blue-900'>
              Depoimentos
            </h2>
            <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
            <p className='mx-auto max-w-3xl text-gray-600'>
              Veja o que nossos alunos dizem sobre sua experiência na Budokan e
              como as artes marciais transformaram suas vidas.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            <div className='rounded-lg bg-blue-50 p-6'>
              <div className='mb-4 flex items-center'>
                <div className='relative mr-4 h-12 w-12'>
                  <Image
                    src='/placeholder.svg?height=50&width=50'
                    alt='Student'
                    fill
                    className='rounded-full object-cover'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-blue-900'>Carlos Silva</h4>
                  <p className='text-sm text-gray-500'>
                    Praticante de Karate-Do há 5 anos
                  </p>
                </div>
              </div>
              <p className='text-gray-600 italic'>
                "A Budokan mudou minha vida. Além de melhorar minha condição
                física, o Karate-Do me ensinou disciplina, foco e respeito,
                valores que aplico diariamente em minha vida pessoal e
                profissional."
              </p>
            </div>

            <div className='rounded-lg bg-blue-50 p-6'>
              <div className='mb-4 flex items-center'>
                <div className='relative mr-4 h-12 w-12'>
                  <Image
                    src='/placeholder.svg?height=50&width=50'
                    alt='Student'
                    fill
                    className='rounded-full object-cover'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-blue-900'>Mariana Santos</h4>
                  <p className='text-sm text-gray-500'>
                    Praticante de Kendo há 3 anos
                  </p>
                </div>
              </div>
              <p className='text-gray-600 italic'>
                "O ambiente na Budokan é acolhedor e ao mesmo tempo desafiador.
                Os senseis são extremamente qualificados e atenciosos. O Kendo
                me trouxe equilíbrio emocional e físico que eu não encontrei em
                nenhuma outra atividade."
              </p>
            </div>

            <div className='rounded-lg bg-blue-50 p-6'>
              <div className='mb-4 flex items-center'>
                <div className='relative mr-4 h-12 w-12'>
                  <Image
                    src='/placeholder.svg?height=50&width=50'
                    alt='Student'
                    fill
                    className='rounded-full object-cover'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-blue-900'>Roberto Tanaka</h4>
                  <p className='text-sm text-gray-500'>
                    Praticante de Kyudo há 7 anos
                  </p>
                </div>
              </div>
              <p className='text-gray-600 italic'>
                "O Kyudo na Budokan é uma experiência transformadora. Mais que
                uma arte marcial, é uma jornada de autoconhecimento. Cada tiro
                com o arco é uma oportunidade de conectar corpo, mente e
                espírito em perfeita harmonia."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='bg-blue-50 py-16'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-blue-900'>
              Entre em Contato
            </h2>
            <div className='bg-primary mx-auto mb-6 h-1 w-20'></div>
            <p className='mx-auto max-w-3xl text-gray-600'>
              Estamos à disposição para esclarecer suas dúvidas e fornecer mais
              informações sobre nossas modalidades e horários.
            </p>
          </div>

          <div className='grid gap-12 md:grid-cols-2'>
            <div>
              <form className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='name'
                      className='mb-1 block text-sm font-medium text-gray-700'
                    >
                      Nome
                    </label>
                    <input
                      type='text'
                      id='name'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='email'
                      className='mb-1 block text-sm font-medium text-gray-700'
                    >
                      E-mail
                    </label>
                    <input
                      type='email'
                      id='email'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='subject'
                    className='mb-1 block text-sm font-medium text-gray-700'
                  >
                    Assunto
                  </label>
                  <input
                    type='text'
                    id='subject'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label
                    htmlFor='message'
                    className='mb-1 block text-sm font-medium text-gray-700'
                  >
                    Mensagem
                  </label>
                  <textarea
                    id='message'
                    rows={5}
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                </div>
                <Button className='bg-primary hover:bg-primary/90 w-full border-0 py-3 text-white'>
                  Enviar Mensagem
                </Button>
              </form>
            </div>
            <div>
              <div className='rounded-lg bg-white p-6 shadow-md'>
                <h3 className='mb-4 text-xl font-bold text-blue-900'>
                  Informações de Contato
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='text-primary mt-0.5 mr-3 h-5 w-5'
                    >
                      <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
                      <circle cx='12' cy='10' r='3' />
                    </svg>
                    <div>
                      <h4 className='font-bold text-blue-900'>Endereço</h4>
                      <p className='text-gray-600'>
                        Rua das Artes Marciais, 123 - São Paulo, SP
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='text-primary mt-0.5 mr-3 h-5 w-5'
                    >
                      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                    </svg>
                    <div>
                      <h4 className='font-bold text-blue-900'>Telefone</h4>
                      <p className='text-gray-600'>(11) 99999-9999</p>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='text-primary mt-0.5 mr-3 h-5 w-5'
                    >
                      <rect width='20' height='16' x='2' y='4' rx='2' />
                      <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
                    </svg>
                    <div>
                      <h4 className='font-bold text-blue-900'>E-mail</h4>
                      <p className='text-gray-600'>contato@budokan.com.br</p>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='text-primary mt-0.5 mr-3 h-5 w-5'
                    >
                      <rect width='18' height='18' x='3' y='3' rx='2' />
                      <path d='M21 9H3' />
                      <path d='M9 21V9' />
                    </svg>
                    <div>
                      <h4 className='font-bold text-blue-900'>
                        Horário de Funcionamento
                      </h4>
                      <p className='text-gray-600'>
                        Segunda a Sexta: 16:00 - 21:30
                      </p>
                      <p className='text-gray-600'>Sábado: 09:00 - 16:00</p>
                      <p className='text-gray-600'>Domingo: 09:00 - 12:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
