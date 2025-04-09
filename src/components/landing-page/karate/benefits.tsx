import { Award, ChevronRight, Users } from "lucide-react";

export const BenefitsSection = () => {
    return (
        <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Benefícios do Karate-Do</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-gray-600">
              A prática regular do Karate-Do proporciona inúmeros benefícios físicos, mentais e sociais, contribuindo
              para uma vida mais saudável e equilibrada.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">Benefícios Físicos</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Melhora da força, flexibilidade e resistência</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Desenvolvimento da coordenação motora e equilíbrio</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Aumento da capacidade cardiovascular</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Melhora da postura e alinhamento corporal</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Desenvolvimento de reflexos rápidos e precisos</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-800"
                >
                  <path d="M12 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">Benefícios Mentais</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Redução do estresse e ansiedade</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Aumento da concentração e foco</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Desenvolvimento da disciplina e perseverança</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Melhora da autoconfiança e autoestima</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Desenvolvimento de resiliência emocional</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3">Benefícios Sociais</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Desenvolvimento de respeito pelos outros</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Integração em uma comunidade de praticantes</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Aprendizado de trabalho em equipe</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Desenvolvimento de liderança e responsabilidade</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Criação de amizades duradouras</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
}