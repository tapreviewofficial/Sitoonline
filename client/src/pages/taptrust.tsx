import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Shield, Smartphone, Star, Users, CheckCircle, Zap } from "lucide-react";

export default function TapTrustHub() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <article>
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cos'è TapTrust®
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              L'infrastruttura europea per recensioni verificate tramite tecnologia NFC.
            </p>
          </header>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">TapTrust è un'Infrastruttura di Fiducia</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              TapTrust non è un semplice strumento per raccogliere recensioni. È un'infrastruttura di fiducia che trasforma ogni interazione cliente-azienda in un atto verificabile e autentico.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Attraverso la tecnologia NFC integrata in card premium, TapTrust permette ai clienti di lasciare recensioni con un semplice tap del telefono. Nessuna app da scaricare, nessun QR code da scansionare. Solo un gesto naturale che genera fiducia.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ogni recensione raccolta tramite TapTrust è tracciabile, verificata e autentica. Un nuovo standard europeo per la reputazione digitale.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Perché TapTrust Esiste</h2>
            <div className="bg-gray-50 rounded-2xl p-8 mb-6">
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Le recensioni online sono diventate la valuta della fiducia nel mondo digitale. Ma questa valuta è stata inflazionata da recensioni false, comprate o manipolate.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                TapTrust nasce per ristabilire l'autenticità. Ogni codice TapTrust (TT-XXXX-XX) certifica che il recensore era fisicamente presente nel locale. La fiducia torna ad essere meritata, non manipolata.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Come Funziona</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#faf8f5] rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-[#C9A054] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1. Tap</h3>
                <p className="text-gray-600">Il cliente avvicina il telefono alla card TapTrust NFC</p>
              </div>
              <div className="bg-[#faf8f5] rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-[#C9A054] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2. Recensione</h3>
                <p className="text-gray-600">Si apre direttamente la pagina per lasciare una recensione</p>
              </div>
              <div className="bg-[#faf8f5] rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-[#C9A054] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">3. Verifica</h3>
                <p className="text-gray-600">Un codice univoco certifica l'autenticità della visita</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Differenze con Google Reviews</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-4 font-bold text-gray-900">Caratteristica</th>
                    <th className="text-left p-4 font-bold text-gray-900">TapTrust®</th>
                    <th className="text-left p-4 font-bold text-gray-900">Google Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">Verifica presenza fisica</td>
                    <td className="p-4 text-green-600 font-semibold">✓ Sì, tramite NFC</td>
                    <td className="p-4 text-red-500">✗ No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">Codice tracciabile</td>
                    <td className="p-4 text-green-600 font-semibold">✓ TT-XXXX-XX</td>
                    <td className="p-4 text-red-500">✗ Non disponibile</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">Time-lock (validità temporale)</td>
                    <td className="p-4 text-green-600 font-semibold">✓ 12 ore</td>
                    <td className="p-4 text-red-500">✗ Nessun limite</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">Protezione da recensioni false</td>
                    <td className="p-4 text-green-600 font-semibold">✓ Elevata</td>
                    <td className="p-4 text-red-500">✗ Limitata</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-700">Analytics dedicati</td>
                    <td className="p-4 text-green-600 font-semibold">✓ Dashboard completa</td>
                    <td className="p-4 text-yellow-600">◐ Base</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Per Chi è TapTrust</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#C9A054] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Ristoranti</h3>
                  <p className="text-gray-600">Raccogli recensioni autentiche dai clienti che hanno realmente cenato da te</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#C9A054] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Hotel</h3>
                  <p className="text-gray-600">Verifica che ogni recensione provenga da un ospite reale</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#C9A054] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Retail & Negozi</h3>
                  <p className="text-gray-600">Trasforma ogni acquisto in un'opportunità di feedback verificato</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#C9A054] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Brand di Lusso</h3>
                  <p className="text-gray-600">Mantieni l'esclusività anche nella raccolta di feedback</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16 bg-[#0a0a0a] rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Uno Standard Europeo</h2>
            <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
              TapTrust è progettato e sviluppato in Europa, con attenzione alla privacy e alla conformità GDPR. La fiducia non conosce confini, ma rispetta le regole.
            </p>
            <div className="flex items-center justify-center gap-2 text-[#C9A054]">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Tecnologia NFC • Privacy by Design • Made in Europe</span>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Inizia con TapTrust</h2>
            <p className="text-lg text-gray-600 mb-8">
              Unisciti alle attività che hanno scelto di rendere la fiducia misurabile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold px-8 py-6 text-lg">
                  Richiedi Accesso
                </Button>
              </Link>
              <Link href="/manifesto">
                <Button variant="outline" className="border-2 border-gray-300 px-8 py-6 text-lg">
                  Leggi il Manifesto
                </Button>
              </Link>
            </div>
          </section>
        </article>
      </main>

      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto max-w-4xl px-4 text-center text-gray-600">
          <p>© 2024 TapTrust® – Tutti i diritti riservati</p>
          <p className="mt-2 text-sm">L'infrastruttura europea per recensioni verificate</p>
        </div>
      </footer>
    </div>
  );
}
