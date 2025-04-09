import { Clock } from "lucide-react";

export const ScheduleSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-blue-800 mb-4">Horários de Treinamento</h2>
                        <div className="w-20 h-1 bg-yellow-500 mb-6"></div>
                        <p className="text-gray-600 mb-6">
                            Oferecemos horários flexíveis para atender às necessidades de nossos alunos, com turmas separadas por
                            níveis de experiência e faixas etárias.
                        </p>

                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                                    Segunda-feira
                                </h3>
                                <ul className="space-y-1 text-gray-600 flex flex-row justify-between w-full px-10">
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">07:00 - 08:00</span>
                                    </li>
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">17:00 - 18:00</span>
                                    </li>
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">18:30 - 19:30</span>
                                        <span className="font-medium">19:30 - 20:30</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                                    Quarta-feira
                                </h3>
                                <ul className="space-y-1 text-gray-600 flex flex-row justify-between w-full px-10">
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">07:00 - 08:00</span>
                                    </li>
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">16:00 - 17:00</span>
                                        <span className="font-medium">17:00 - 18:00</span>
                                    </li>
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">18:30 - 19:30</span>
                                        <span className="font-medium">19:30 - 20:30</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                                    Sexta-feira
                                </h3>
                                <ul className="space-y-1 text-gray-600 flex flex-row justify-between w-full px-10">
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">07:00 - 08:00</span>
                                    </li>
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">16:00 - 17:00</span>
                                        <span className="font-medium">17:00 - 18:00</span>
                                    </li>
                                    <li className="flex flex-col justify-between">
                                        <span className="font-medium">18:30 - 19:30</span>
                                        <span className="font-medium">19:30 - 20:30</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-800 text-white p-8 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Sistema de Graduação</h3>
                        <p className="mb-6 opacity-90">
                            No Karate-Do Shotokan, o sistema de graduação é dividido em kyu (faixas coloridas) e dan (faixas
                            pretas), representando o progresso técnico e desenvolvimento do praticante.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold mb-2">Faixas Kyu (Iniciantes a Intermediários)</h4>
                                <div className="grid grid-cols gap-2">
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 bg-white rounded-full mr-2"></div>
                                        <span>7º Kyu - Branca</span>
                                    </div>
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 bg-yellow-300 rounded-full mr-2"></div>
                                        <span>6º Kyu - Amarela</span>
                                    </div>
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                                        <span>5º Kyu - Vermelha</span>
                                    </div>
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                                        <span>4º Kyu - Laranja</span>
                                    </div>
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-700 rounded-full mr-2"></div>
                                        <span>3º Kyu - Verde</span>
                                    </div>
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                                        <span>2º Kyu - Roxa</span>
                                    </div>
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 bg-amber-950 rounded-full mr-2"></div>
                                        <span>1º Kyu - Marron</span>
                                    </div>
                                </div>
                            </div>
                        <div>
                            <h4 className="font-bold mb-2">Faixas Dan (Avançados)</h4>
                            <p className="text-sm opacity-90 mb-2">
                                Do 1º ao 10º Dan - Faixa Preta (com diferentes níveis de experiência e conhecimento)
                            </p>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-black rounded-full mr-2 border border-white"></div>
                                <span>Faixa Preta - Representa dedicação e domínio técnico</span>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}