import React, { useEffect, useState } from "react";
import { useParams } from "wouter";

export default function PublicClaimPage() {
  const { username } = useParams();
  const [promo, setPromo] = useState<any>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => { (async () => {
    const r = await fetch(`/api/public/${username}/active-promo`);
    setPromo(await r.json());
  })(); }, [username]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = { 
      name: fd.get("name")?.toString(), 
      surname: fd.get("surname")?.toString(), 
      email: fd.get("email")?.toString() 
    };
    const r = await fetch(`/api/public/${username}/claim`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(body) 
    });
    if (r.ok) setSent(true); else alert("Errore invio");
  }

  if (!promo) return <div className="p-6 text-white">Caricamento…</div>;
  if (!promo.active) return <div className="p-6 text-white">Nessuna promozione attiva.</div>;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 rounded p-5">
        <h1 className="text-xl font-bold mb-2">{promo.title}</h1>
        <p className="opacity-80 mb-4">{promo.description}</p>
        {!sent ? (
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Nome</label>
              <input name="name" className="w-full bg-zinc-800 rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Cognome</label>
              <input name="surname" className="w-full bg-zinc-800 rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" name="email" className="w-full bg-zinc-800 rounded px-3 py-2" required />
            </div>
            <button className="w-full px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold">
              Ricevi il QR via email
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p>Controlla la tua email 📩</p>
          </div>
        )}
      </div>
    </div>
  );
}