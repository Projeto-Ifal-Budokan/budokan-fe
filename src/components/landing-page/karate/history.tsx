export const HistorySection = () => {
    return (
        <section className="py-16 bg-blue-50">
            <div className="container">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-blue-800 mb-4">História do Karate-Do</h2>
                <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
                <p className="max-w-3xl mx-auto text-gray-600">
                Conheça a rica história desta arte marcial milenar e sua evolução até os dias atuais.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Origens em Okinawa</h3>
                    <p className="text-gray-600">
                    O Karate se desenvolveu em Okinawa, uma ilha que hoje pertence ao Japão, mas que por muito tempo
                    teve forte influência chinesa. A arte surgiu da necessidade de defesa pessoal em uma época em que
                    armas eram proibidas pela ocupação japonesa, forçando os nativos a desenvolverem métodos de combate
                    desarmado.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Introdução no Japão</h3>
                    <p className="text-gray-600">
                    No início do século XX, mestres como Gichin Funakoshi introduziram o Karate no Japão continental.
                    Funakoshi, considerado o pai do Karate moderno, fundou o estilo Shotokan e foi fundamental para a
                    sistematização e popularização da arte.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Globalização</h3>
                    <p className="text-gray-600">
                    Após a Segunda Guerra Mundial, o Karate se espalhou pelo mundo, tornando-se uma das artes marciais
                    mais praticadas globalmente. Hoje, é reconhecido como esporte olímpico, mantendo ao mesmo tempo suas
                    raízes tradicionais e filosóficas.
                    </p>
                </div>
                </div>
                <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Karate-Do na Budokan</h3>
                    <p className="text-gray-600">
                    Na Budokan, o Karate-Do tem sido ensinado desde a fundação da escola, seguindo os princípios
                    tradicionais estabelecidos pelos grandes mestres. Nossa linhagem técnica remonta diretamente aos
                    pioneiros do Karate Shotokan, garantindo a autenticidade dos ensinamentos.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Competições e Conquistas</h3>
                    <p className="text-gray-600">
                    Ao longo dos anos, os alunos da Budokan têm se destacado em competições regionais, nacionais e
                    internacionais, conquistando inúmeras medalhas e reconhecimentos. Valorizamos tanto o aspecto
                    competitivo quanto o desenvolvimento pessoal de cada praticante.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Preservação da Tradição</h3>
                    <p className="text-gray-600">
                    Mantemos viva a tradição do Karate-Do através da prática rigorosa de katas (formas), kumite
                    (combate) e kihon (fundamentos), sempre enfatizando os valores de respeito, disciplina e busca pela
                    perfeição técnica e espiritual.
                    </p>
                </div>
                </div>
            </div>
            </div>
        </section>
    );
}