'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, X, MapPin } from 'lucide-react';
import { Destination } from '@/types';
import { createDestination, deleteDestination, getAllDestinations, updateDestination } from '@/services/destinationsService';

const emptyForm = { name: '', country: '', description: '', imageUrl: '', isActive: true };

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadDestinations(); }, []);

  async function loadDestinations() {
    try { setDestinations(await getAllDestinations()); }
    catch (error) { console.error('Erreur chargement destinations:', error); }
    finally { setLoading(false); }
  }

  const filtered = destinations.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (destination: Destination) => { setForm({ name: destination.name, country: destination.country, description: destination.description, imageUrl: destination.imageUrl, isActive: destination.isActive }); setEditingId(destination.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        const updated = await updateDestination(editingId, form);
        setDestinations(destinations.map((d) => d.id === editingId ? updated : d));
      } else {
        const created = await createDestination(form);
        setDestinations([created, ...destinations]);
      }
      closeForm();
    } catch (error) {
      console.error('Erreur sauvegarde destination:', error);
      alert("Erreur lors de la sauvegarde de la destination.");
    } finally {
      setSaving(false);
    }
  };

  const removeDestination = async (id: string) => {
    if (!confirm('Supprimer cette destination ? Les offres liées seront aussi supprimées si la contrainte SQL cascade est active.')) return;
    try {
      await deleteDestination(id);
      setDestinations(destinations.filter((d) => d.id !== id));
    } catch (error) {
      console.error('Erreur suppression destination:', error);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div><h1 className="text-2xl font-bold text-gray-900">Destinations</h1><p className="text-gray-500 text-sm mt-1">{destinations.length} destinations au total</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"><Plus className="w-4 h-4" />Ajouter une destination</button>
      </div>

      <div className="relative max-w-sm mb-6"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>

      {loading ? <p className="text-gray-500">Chargement...</p> : filtered.length === 0 ? <div className="text-center py-12 bg-white rounded-2xl border border-gray-100"><MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">Aucune destination trouvée</p></div> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((destination) => (
            <div key={destination.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-[16/9]"><Image src={destination.imageUrl || 'https://images.pexels.com/photos/2104792/pexels-photo-2104792.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={destination.name} fill className="object-cover" /></div>
              <div className="p-5"><div className="flex items-start justify-between gap-3 mb-2"><div><h3 className="font-bold text-gray-900">{destination.name}</h3><p className="text-sm text-gray-500">{destination.country}</p></div><span className={`text-xs px-2 py-1 rounded-full ${destination.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{destination.isActive ? 'Active' : 'Inactive'}</span></div><p className="text-gray-500 text-sm line-clamp-3 mb-4">{destination.description}</p><div className="flex gap-2"><button onClick={() => openEdit(destination)} className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-2 text-sm"><Pencil className="w-4 h-4" />Modifier</button><button onClick={() => removeDestination(destination.id)} className="inline-flex items-center justify-center border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-3"><Trash2 className="w-4 h-4" /></button></div></div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={submitForm} className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900">{editingId ? 'Modifier la destination' : 'Ajouter une destination'}</h2><button type="button" onClick={closeForm}><X className="w-5 h-5 text-gray-500" /></button></div>
            <div className="grid sm:grid-cols-2 gap-4"><Input label="Nom" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required /><Input label="Pays" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required /></div>
            <Input label="Image URL" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Destination active</label>
            <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={closeForm} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm">Annuler</button><button disabled={saving} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{label}{required ? ' *' : ''}</label><input required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>;
}
