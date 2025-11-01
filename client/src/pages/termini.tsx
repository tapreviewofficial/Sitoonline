import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Termini() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" data-testid="title-termini">
          Termini e Condizioni d'Uso
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-600 mb-8">
            Ultimo aggiornamento: 2025
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            L'accesso e l'utilizzo del sito <a href="https://www.taptrust.it" className="text-[#C9A054] hover:underline">www.taptrust.it</a> implicano l'accettazione dei seguenti Termini e Condizioni.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            1. Oggetto
          </h2>
          <p className="text-gray-700 mb-6">
            TapTrust™ fornisce una piattaforma digitale per la raccolta e la validazione di recensioni autentiche, tramite tecnologia NFC.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            2. Proprietà intellettuale
          </h2>
          <p className="text-gray-700 mb-6">
            Tutti i contenuti, testi, loghi, marchi e design presenti sul sito sono di proprietà esclusiva di TapTrust™.
            È vietata ogni riproduzione, distribuzione o utilizzo non autorizzato.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            3. Limitazioni di responsabilità
          </h2>
          <p className="text-gray-700 mb-6">
            TapTrust non garantisce la continuità del servizio in caso di eventi esterni, manutenzione o cause di forza maggiore.
            Non risponde per eventuali danni indiretti o perdita di profitto derivanti da malfunzionamenti o uso improprio del sito.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            4. Uso corretto del servizio
          </h2>
          <p className="text-gray-700 mb-6">
            L'utente si impegna a fornire informazioni veritiere e a non utilizzare la piattaforma per scopi fraudolenti o contrari alla legge.
            TapTrust può sospendere o chiudere account che violano le regole di autenticità.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            5. Collegamenti esterni
          </h2>
          <p className="text-gray-700 mb-6">
            Il sito può contenere link a servizi di terze parti (es. Google, Meta, ecc.).
            TapTrust non è affiliata né responsabile per i contenuti di tali siti.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            6. Foro competente
          </h2>
          <p className="text-gray-700 mb-6">
            Per qualsiasi controversia è competente in via esclusiva il Foro di Venezia (Italia).
          </p>
          
          <div className="bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] p-6 rounded-xl my-8">
            <p className="text-center text-gray-700 font-semibold">
              © 2025 TapTrust™ — Reputazione Tangibile. Tutti i diritti riservati.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/">
            <Button className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold px-8 py-5" data-testid="button-back-home">
              Torna alla Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
