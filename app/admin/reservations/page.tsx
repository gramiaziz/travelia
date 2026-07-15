'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronDown, ClipboardList, Trash2 } from 'lucide-react';
import { Reservation } from '@/types';
import { deleteReservation, getReservations, updateReservationStatus } from '@/services/reservationsService';

const statusLabels: Record<Reservation['status'], string> = { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée' };
const statusStyles: Record<Reservation['status'], string> = { pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { loadReservations(); }, []);

  async function loadReservations() {
    try { setReservations(await getReservations()); }
    catch (error) { console.error('Erreur chargement réservations:', error); }
    finally { setLoading(false); }
  }

  const filtered = reservations.filter((r) => {
    const matchSearch = r.fullName.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()) || r.packageTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const changeStatus = async (id: string, status: Reservation['status']) => {
    try {
      const updated = await updateReservationStatus(id, status);
      setReservations(reservations.map((r) => r.id === id ? updated : r));
    } catch (error) {
      console.error('Erreur changement statut réservation:', error);
      alert('Erreur lors du changement de statut.');
    }
  };

  const removeReservation = async (id: string) => {
    if (!confirm('Supprimer cette réservation ?')) return;
    try {
      await deleteReservation(id);
      setReservations(reservations.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Erreur suppression réservation:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Réservations</h1><p className="text-gray-500 text-sm mt-1">{reservations.length} demandes au total</p></div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Tous les statuts</option><option value="pending">En attente</option><option value="confirmed">Confirmée</option><option value="cancelled">Annulée</option></select>
      </div>

      {loading ? <p className="text-gray-500">Chargement...</p> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th><th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Offre</th><th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Personnes</th><th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th><th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th><th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-50">
            {filtered.map((r) => <tr key={r.id} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4"><p className="font-medium text-gray-900 text-sm">{r.fullName}</p><p className="text-gray-400 text-xs">{r.email}</p><p className="text-gray-400 text-xs">{r.phone}</p></td><td className="px-6 py-4"><p className="text-sm text-gray-700 max-w-[180px]">{r.packageTitle}</p>{r.message && <p className="text-gray-400 text-xs mt-1 max-w-[180px] truncate italic">&quot;{r.message}&quot;</p>}</td><td className="px-6 py-4 text-sm text-gray-600">{r.numberOfPeople}</td><td className="px-6 py-4 text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</td><td className="px-6 py-4"><div className="relative"><select value={r.status} onChange={(e) => changeStatus(r.id, e.target.value as Reservation['status'])} className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusStyles[r.status]}`}><option value="pending">En attente</option><option value="confirmed">Confirmée</option><option value="cancelled">Annulée</option></select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" /></div></td><td className="px-6 py-4"><button onClick={() => removeReservation(r.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td></tr>)}
          </tbody></table></div>
          {filtered.length === 0 && <div className="text-center py-12"><ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">Aucune réservation trouvée</p></div>}
        </div>
      )}
    </div>
  );
}
