import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

export default function Manifesto() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <article className="text-white">
          <header className="text-center mb-16 border-b border-white/10 pb-16">
            <span className="text-[#C9A054] text-sm font-semibold tracking-widest uppercase mb-4 block">
              Il Manifesto
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              La Fiducia è uno Standard
            </h1>
            <p className="text-xl text-white/60">
              Non un'opinione. Non una sensazione. Uno standard.
            </p>
          </header>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#C9A054] mb-6">I. Il Problema</h2>
            <p className="text-lg text-white/80 mb-4 leading-relaxed">
              Le recensioni online hanno perso credibilità. Chiunque può scrivere qualsiasi cosa su qualsiasi attività, senza mai averci messo piede. Le recensioni false, comprate o manipolate hanno inflazionato la valuta della fiducia digitale.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              I consumatori non sanno più di chi fidarsi. Le attività oneste vengono penalizzate da competitor senza scrupoli. Il sistema è rotto.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#C9A054] mb-6">II. La Nostra Visione</h2>
            <p className="text-lg text-white/80 mb-4 leading-relaxed">
              Crediamo che ogni recensione debba essere guadagnata, non comprata. Crediamo che la presenza fisica sia la prova più autentica di un'esperienza vissuta. Crediamo che la tecnologia debba servire la verità, non nasconderla.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              TapTrust esiste per ristabilire l'ordine. Per dare alle attività oneste gli strumenti per dimostrare la loro qualità. Per dare ai consumatori la certezza di leggere opinioni autentiche.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#C9A054] mb-6">III. I Nostri Principi</h2>
            <div className="space-y-6">
              <div className="border-l-2 border-[#C9A054] pl-6">
                <h3 className="text-xl font-bold text-white mb-2">Autenticità Verificabile</h3>
                <p className="text-white/70">Ogni recensione TapTrust è collegata a un codice univoco che certifica la presenza fisica del recensore. Non ci sono scorciatoie.</p>
              </div>
              <div className="border-l-2 border-[#C9A054] pl-6">
                <h3 className="text-xl font-bold text-white mb-2">Semplicità Radicale</h3>
                <p className="text-white/70">Un tap. Nessuna app. Nessuna registrazione. La tecnologia migliore è quella che non si nota.</p>
              </div>
              <div className="border-l-2 border-[#C9A054] pl-6">
                <h3 className="text-xl font-bold text-white mb-2">Privacy by Design</h3>
                <p className="text-white/70">Non raccogliamo dati personali dei clienti. Non vendiamo informazioni. La fiducia si costruisce rispettando la privacy.</p>
              </div>
              <div className="border-l-2 border-[#C9A054] pl-6">
                <h3 className="text-xl font-bold text-white mb-2">Standard Europeo</h3>
                <p className="text-white/70">Progettato in Europa, per l'Europa. Conforme al GDPR. La qualità non ha bisogno di compromessi.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#C9A054] mb-6">IV. Il Nostro Impegno</h2>
            <p className="text-lg text-white/80 mb-4 leading-relaxed">
              Ci impegniamo a non vendere mai recensioni. Ci impegniamo a non manipolare mai i risultati. Ci impegniamo a costruire tecnologia che serve la verità.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              TapTrust non è un prodotto. È uno standard. E gli standard non si negoziano.
            </p>
          </section>

          <section className="mb-16 bg-white/5 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">V. La Promessa</h2>
            <blockquote className="text-xl text-white/90 text-center italic leading-relaxed">
              "Ogni codice TapTrust è una promessa: questa recensione viene da qualcuno che c'era davvero."
            </blockquote>
          </section>

          <section className="text-center border-t border-white/10 pt-16">
            <p className="text-white/60 mb-8">
              Unisciti a chi ha scelto di rendere la fiducia misurabile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold px-8 py-6 text-lg">
                  Inizia con TapTrust
                </Button>
              </Link>
              <Link href="/taptrust">
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Scopri Come Funziona
                </Button>
              </Link>
            </div>
          </section>
        </article>
      </main>

      <footer className="bg-black py-8 mt-16 border-t border-white/10">
        <div className="container mx-auto max-w-3xl px-4 text-center text-white/40">
          <p>© 2024 TapTrust® – Tutti i diritti riservati</p>
          <p className="mt-2 text-sm">L'infrastruttura europea per recensioni verificate</p>
        </div>
      </footer>
    </div>
  );
}
