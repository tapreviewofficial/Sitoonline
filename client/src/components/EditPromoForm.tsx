import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

type FormData = {
  title: string;
  description: string;
  type: "coupon" | "event" | "visit" | "combo";
  valueKind: "percent" | "euro" | "points";
  value: number;
  notCumulative: boolean;
  onePerCustomer: boolean;
  startAt: string;
  endAt: string;
  maxCodes: number;
  usesPerCode: number;
  codeFormat: "short" | "long" | "custom";
  qrMode: "url" | "data";
};

interface EditPromoFormProps {
  promo: any;
  open: boolean;
  onClose: () => void;
}

async function updatePromoApi(id: number, data: any) {
  const response = await fetch(`/api/promos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Errore aggiornamento promozione");
  }
  
  return response.json();
}

export default function EditPromoForm({ promo, open, onClose }: EditPromoFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: promo.title || "",
      description: promo.description || "",
      type: promo.type || "coupon",
      valueKind: promo.valueKind || "percent",
      value: promo.value || 0,
      notCumulative: promo.notCumulative || false,
      onePerCustomer: promo.onePerCustomer || true,
      startAt: promo.startAt ? new Date(promo.startAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      endAt: promo.endAt ? new Date(promo.endAt).toISOString().slice(0, 16) : new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      maxCodes: promo.maxCodes || 100,
      usesPerCode: promo.usesPerCode || 1,
      codeFormat: promo.codeFormat || "short",
      qrMode: promo.qrMode || "url",
    },
    mode: "onChange",
  });

  const type = watch("type");
  const valueKind = watch("valueKind");

  async function onSubmit(d: FormData) {
    if (!d.title.trim()) return alert("Titolo obbligatorio");
    if (!d.description.trim()) return alert("Descrizione obbligatoria");
    if (d.description.length > 200) return alert("Descrizione max 200 caratteri");

    const start = new Date(d.startAt);
    const end = new Date(d.endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return alert("Date non valide");
    if (end < start) return alert("La fine deve essere >= inizio");

    if (type === "coupon") {
      if (!d.valueKind) return alert("Seleziona il tipo di valore (%, €)");
      if (!d.value || d.value <= 0) return alert("Inserisci un valore > 0");
      if (d.valueKind === "percent" && d.value > 100) return alert("Percentuale max 100");
    }

    if (d.maxCodes <= 0) return alert("Max codici deve essere > 0");
    if (d.usesPerCode <= 0) return alert("Utilizzi per codice almeno 1");

    // Payload compatibile con API esistente /api/promos/:id
    const payload = {
      title: d.title.trim(),
      description: d.description.trim(),
      type: d.type,
      startAt: d.startAt,
      endAt: d.endAt,
    };

    try {
      await updatePromoApi(promo.id, payload);
      // Invalidate and refetch promos list
      queryClient.invalidateQueries({ queryKey: ["api", "promos"] });
      alert("Promozione aggiornata ✅");
      onClose();
    } catch (e: any) {
      alert(e?.message || "Errore");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Modifica Promozione</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titolo</label>
            <input
              {...register("title", { required: true })}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
              placeholder="Nome della promozione"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrizione</label>
            <textarea
              {...register("description", { required: true, maxLength: 200 })}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
              rows={3}
              placeholder="Descrivi la promozione (max 200 caratteri)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                {...register("type")}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
              >
                <option value="coupon">Sconto/Coupon</option>
                <option value="event">Evento</option>
                <option value="visit">Visita</option>
                <option value="combo">Combo</option>
              </select>
            </div>

            {type === "coupon" && (
              <div>
                <label className="block text-sm font-medium mb-1">Tipo Valore</label>
                <select
                  {...register("valueKind")}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                >
                  <option value="percent">Percentuale (%)</option>
                  <option value="euro">Euro (€)</option>
                  <option value="points">Punti</option>
                </select>
              </div>
            )}
          </div>

          {type === "coupon" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Valore {valueKind === "percent" ? "(%)" : valueKind === "euro" ? "(€)" : "(punti)"}
              </label>
              <input
                type="number"
                step="0.01"
                {...register("value", { valueAsNumber: true })}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                placeholder={valueKind === "percent" ? "es. 20" : valueKind === "euro" ? "es. 5.00" : "es. 100"}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data Inizio</label>
              <input
                type="datetime-local"
                {...register("startAt")}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Fine</label>
              <input
                type="datetime-local"
                {...register("endAt")}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded bg-[#CC9900] hover:bg-[#CC9900]/90 text-black font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Salvo…" : "Aggiorna promozione"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}