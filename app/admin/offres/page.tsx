'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, X, Package as PackageIcon } from 'lucide-react';
import { Destination, Package } from '@/types';
import { getAllDestinations } from '@/services/destinationsService';
import { createCompleteOffer, deleteOffer, getAllOffers, updateCompleteOffer } from '@/services/offersService';

type ProgramStepForm = { dayNumber: number; title: string; description: string };
type OfferForm = {
  destinationId: string;
  title: string;
  price: string;
  currency: string;
  durationDays: string;
  durationNights: string;
  departureDate: string;
  availablePlaces: string;
  type: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  included: string[];
  notIncluded: string[];
  program: ProgramStepForm[];
  images: string[];
};

const emptyForm: OfferForm = {
  destinationId: '', title: '', price: '', currency: 'TND', durationDays: '', durationNights: '', departureDate: '', availablePlaces: '', type: 'culturel', description: '', imageUrl: '', isActive: true,
  included: [''], notIncluded: [''], program: [{ dayNumber: 1, title: '', description: '' }], images: [''],
};

export default function AdminOffresPage() {
  const [offers, setOffers] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OfferForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [offersData, destinationsData] = await Promise.all([getAllOffers(), getAllDestinations()]);
      setOffers(offersData);
      setDestinations(destinationsData);
    } catch (error) {
      console.error('Erreur chargement offres:', error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = offers.filter((offer) => offer.title.toLowerCase().includes(search.toLowerCase()) || offer.destination.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setForm({ ...emptyForm, destinationId: destinations[0]?.id ?? '' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (offer: Package) => {
    setForm({
      destinationId: offer.destinationId,
      title: offer.title,
      price: String(offer.price),
      currency: offer.currency,
      durationDays: String(offer.durationDays),
      durationNights: String(offer.durationNights),
      departureDate: offer.departureDate,
      availablePlaces: String(offer.availablePlaces),
      type: offer.type,
      description: offer.description,
      imageUrl: offer.imageUrl,
      isActive: offer.isActive,
      included: offer.included.length ? offer.included : [''],
      notIncluded: offer.notIncluded.length ? offer.notIncluded : [''],
      program: offer.program.length ? offer.program : [{ dayNumber: 1, title: '', description: '' }],
      images: [''],
    });
    setEditingId(offer.id);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        offer: {
          destinationId: form.destinationId,
          title: form.title,
          price: Number(form.price),
          currency: form.currency,
          durationDays: Number(form.durationDays),
          durationNights: Number(form.durationNights),
          departureDate: form.departureDate || undefined,
          availablePlaces: Number(form.availablePlaces || 0),
          type: form.type,
          description: form.description,
          imageUrl: form.imageUrl,
          isActive: form.isActive,
        },
        program: form.program,
        includedItems: form.included,
        notIncludedItems: form.notIncluded,
        images: form.images,
      };

      if (editingId) await updateCompleteOffer(editingId, payload);
      else await createCompleteOffer(payload);

      await loadData();
      closeForm();
    } catch (error) {
      console.error('Erreur sauvegarde offre:', error);
      alert("Erreur lors de la sauvegarde de l'offre.");
    } finally {
      setSaving(false);
    }
  };

  const removeOffer = async (id: string) => {
    if (!confirm('Supprimer cette offre ?')) return;
    try {
      await deleteOffer(id);
      setOffers(offers.filter((offer) => offer.id !== id));
    } catch (error) {
      console.error('Erreur suppression offre:', error);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div><h1 className="text-2xl font-bold text-gray-900">Offres de voyage</h1><p className="text-gray-500 text-sm mt-1">{offers.length} offres au total</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"><Plus className="w-4 h-4" />Ajouter une offre</button>
      </div>

      <div className="relative max-w-sm mb-6"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>

      {loading ? <p className="text-gray-500">Chargement...</p> : filtered.length === 0 ? <div className="text-center py-12 bg-white rounded-2xl border border-gray-100"><PackageIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">Aucune offre trouvée</p></div> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-[16/9]"><Image src={offer.imageUrl || 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={offer.title} fill className="object-cover" /><span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{offer.isActive ? 'Active' : 'Inactive'}</span></div>
              <div className="p-5"><h3 className="font-bold text-gray-900 mb-1">{offer.title}</h3><p className="text-sm text-gray-500 mb-2">{offer.destination}</p><p className="text-blue-700 font-bold mb-4">{offer.price.toLocaleString('fr-FR')} {offer.currency}</p><div className="flex gap-2"><button onClick={() => openEdit(offer)} className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-2 text-sm"><Pencil className="w-4 h-4" />Modifier</button><button onClick={() => removeOffer(offer.id)} className="inline-flex items-center justify-center border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-3"><Trash2 className="w-4 h-4" /></button></div></div>
            </div>
          ))}
        </div>
      )}

  {showForm && (
  <div className="fixed inset-0 z-50 bg-black/50">
    <div className="h-full w-full overflow-y-auto px-3 py-4 sm:px-6 sm:py-8">
      <form
        onSubmit={submitForm}
        className="mx-auto flex min-h-fit w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl"
      >
        {/* Header sticky */}
        <div className=" top-0 z-20 flex items-start justify-between gap-4 rounded-t-2xl border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Modifier l'offre" : "Ajouter une offre"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Remplissez les informations de l’offre de voyage
            </p>
          </div>

          <button
            type="button"
            onClick={closeForm}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Titre">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Destination">
              <select
                required
                value={form.destinationId}
                onChange={(e) =>
                  setForm({ ...form, destinationId: e.target.value })
                }
                className={inputClass}
              >
                <option value="">Choisir une destination</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Prix">
              <input
                required
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Devise">
              <input
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Durée jours">
              <input
                required
                type="number"
                value={form.durationDays}
                onChange={(e) =>
                  setForm({ ...form, durationDays: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Durée nuits">
              <input
                required
                type="number"
                value={form.durationNights}
                onChange={(e) =>
                  setForm({ ...form, durationNights: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Date de départ">
              <input
                type="date"
                value={form.departureDate}
                onChange={(e) =>
                  setForm({ ...form, departureDate: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Places disponibles">
              <input
                type="number"
                value={form.availablePlaces}
                onChange={(e) =>
                  setForm({ ...form, availablePlaces: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Type">
              <input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Image URL">
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className={inputClass}
            />
          </Field>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <ListEditor
              title="Ce qui est inclus"
              values={form.included}
              onChange={(included) => setForm({ ...form, included })}
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <ListEditor
              title="Ce qui n'est pas inclus"
              values={form.notIncluded}
              onChange={(notIncluded) => setForm({ ...form, notIncluded })}
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold text-gray-900">
                Programme jour par jour
              </h3>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    program: [
                      ...form.program,
                      {
                        dayNumber: form.program.length + 1,
                        title: "",
                        description: "",
                      },
                    ],
                  })
                }
                className="text-left text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                + Ajouter une étape
              </button>
            </div>

            <div className="space-y-4">
              {form.program.map((step, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-100 bg-white p-3"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <input
                      type="number"
                      value={step.dayNumber}
                      onChange={(e) =>
                        updateProgram(index, {
                          ...step,
                          dayNumber: Number(e.target.value),
                        })
                      }
                      className={`${inputClass} w-20 sm:col-span-1`}
                      placeholder="Jour"
                    />

                    <input
                      value={step.title}
                      onChange={(e) =>
                        updateProgram(index, {
                          ...step,
                          title: e.target.value,
                        })
                      }
                      className={`${inputClass} sm:col-span-4`}
                      placeholder="Titre"
                    />

                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        updateProgram(index, {
                          ...step,
                          description: e.target.value,
                        })
                      }
                      className={`${inputClass} min-h-24 sm:col-span-5`}
                      placeholder="Description"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          program: form.program.filter((_, i) => i !== index),
                        })
                      }
                      className="rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 sm:col-span-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            Offre active
          </label>
        </div>

        {/* Footer sticky */}
        <div className=" bottom-0 z-20 flex flex-col-reverse gap-3 rounded-b-2xl border-t border-gray-100 bg-white px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={closeForm}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>

          <button
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );

  function updateProgram(index: number, step: ProgramStepForm) {
    setForm({ ...form, program: form.program.map((s, i) => i === index ? step : s) });
  }
}

const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>{children}</div>; }
function ListEditor({ title, values, onChange }: { title: string; values: string[]; onChange: (values: string[]) => void }) {
  return <div className="border border-gray-100 rounded-2xl p-4"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-gray-900">{title}</h3><button type="button" onClick={() => onChange([...values, ''])} className="text-blue-600 text-sm font-medium">+ Ajouter</button></div><div className="space-y-2">{values.map((value, index) => <div key={index} className="flex gap-2"><input value={value} onChange={(e) => onChange(values.map((v, i) => i === index ? e.target.value : v))} className={inputClass} /><button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} className="text-red-500 px-2">Supprimer</button></div>)}</div></div>;
}
