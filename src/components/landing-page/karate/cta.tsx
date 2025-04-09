import { Button } from "@/components/ui/button";

export const CTASection = () => {
    return (
        <section className="py-16 bg-blue-800 text-white">
            <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Comece Sua Jornada no Karate-Do</h2>
            <p className="max-w-2xl mx-auto mb-8 opacity-80">
                Transforme sua vida através da disciplina, respeito e excelência do Karate-Do tradicional. Agende uma aula
                experimental gratuita e conheça a Budokan-Ryu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold px-8 py-6 text-lg">
                Agende uma Aula Experimental
                </Button>
                <Button variant="outline" className="border-white bg-blue-900 text-yellow-500 hover:bg-yellow-500/90 px-8 py-6 text-lg">
                Entre em Contato
                </Button>
            </div>
            </div>
        </section>
    );
}