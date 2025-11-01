import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" data-testid="title-privacy">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-600 mb-8">
            Informativa ai sensi dell'art. 13 Regolamento UE 2016/679 (GDPR)
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Il Titolare del trattamento dei dati è <strong>TapTrust™</strong>, contattabile all'indirizzo email <a href="mailto:info@taptrust.it" className="text-[#C9A054] hover:underline">info@taptrust.it</a>
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Tipologia di dati raccolti
          </h2>
          
          <p className="text-gray-700 mb-4">TapTrust raccoglie e tratta:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>Dati identificativi (nome, email, telefono) forniti volontariamente dagli utenti;</li>
            <li>Dati tecnici (IP, dispositivo, browser, log di accesso);</li>
            <li>Dati relativi alle recensioni, richieste demo e attività sul sito;</li>
            <li>Cookie tecnici e analitici anonimizzati.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Finalità del trattamento
          </h2>
          
          <p className="text-gray-700 mb-4">I dati vengono trattati esclusivamente per:</p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
            <li>Gestire richieste di contatto o demo;</li>
            <li>Fornire i servizi offerti dalla piattaforma TapTrust;</li>
            <li>Prevenire frodi, accessi non autorizzati o abusi;</li>
            <li>Inviare comunicazioni informative solo previo consenso.</li>
          </ol>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Base giuridica
          </h2>
          
          <p className="text-gray-700 mb-4">Il trattamento si fonda su:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>consenso espresso dell'utente (art. 6.1.a GDPR);</li>
            <li>esecuzione di misure precontrattuali o contrattuali (art. 6.1.b);</li>
            <li>obblighi legali (art. 6.1.c).</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Conservazione dei dati
          </h2>
          
          <p className="text-gray-700 mb-6">
            I dati vengono conservati per il tempo strettamente necessario all'erogazione del servizio o fino a revoca del consenso.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            Diritti dell'utente
          </h2>
          
          <p className="text-gray-700 mb-4">L'utente può in ogni momento esercitare i diritti di:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>accesso, rettifica, cancellazione, limitazione e opposizione al trattamento,</li>
            <li>portabilità dei dati,</li>
            <li>reclamo all'Autorità Garante.</li>
          </ul>
          
          <p className="text-gray-700 mb-6">
            Richieste da inviare a: <a href="mailto:info@taptrust.it" className="text-[#C9A054] hover:underline">info@taptrust.it</a>
          </p>
          
          <div className="bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] p-6 rounded-xl my-8">
            <p className="text-gray-700">
              TapTrust adotta misure di sicurezza tecniche e organizzative per proteggere i dati da accessi non autorizzati, perdita o alterazione.
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
