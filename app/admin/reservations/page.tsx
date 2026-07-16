'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  ChevronDown,
  ClipboardList,
  Trash2,
  Calendar,
  Users,
  Mail,
  Phone,
} from 'lucide-react';

import { Reservation } from '@/types';
import {
  deleteReservation,
  getReservations,
  updateReservationStatus,
} from '@/services/reservationsService';

const statusLabels: Record<Reservation['status'], string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
};

const statusStyles: Record<Reservation['status'], string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    void loadReservations();
  }, []);

  async function loadReservations() {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = reservations.filter((reservation) => {
    const normalizedSearch = search.toLowerCase();

    const matchSearch =
      reservation.fullName.toLowerCase().includes(normalizedSearch) ||
      reservation.email.toLowerCase().includes(normalizedSearch) ||
      reservation.packageTitle.toLowerCase().includes(normalizedSearch);

    const matchStatus =
      !filterStatus || reservation.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const changeStatus = async (
    id: string,
    status: Reservation['status'],
  ) => {
    try {
      const updated = await updateReservationStatus(id, status);

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === id ? updated : reservation,
        ),
      );
    } catch (error) {
      console.error('Erreur changement statut réservation:', error);
      alert('Erreur lors du changement de statut.');
    }
  };

  const removeReservation = async (id: string) => {
    if (!confirm('Supprimer cette réservation ?')) {
      return;
    }

    try {
      await deleteReservation(id);

      setReservations((currentReservations) =>
        currentReservations.filter(
          (reservation) => reservation.id !== id,
        ),
      );
    } catch (error) {
      console.error('Erreur suppression réservation:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Réservations
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {reservations.length} demande
          {reservations.length !== 1 ? 's' : ''} au total
        </p>
      </div>

      <div className="mb-6 flex w-full flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:min-w-[180px]"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center shadow-sm">
          <ClipboardList className="mx-auto mb-3 h-8 w-8 text-gray-300" />

          <p className="text-sm text-gray-400">
            Aucune réservation trouvée
          </p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {filtered.map((reservation) => (
              <article
                key={reservation.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {reservation.fullName}
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-gray-700">
                        {reservation.packageTitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void removeReservation(reservation.id)
                      }
                      aria-label="Supprimer la réservation"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                    <span className="min-w-0 break-all text-gray-600">
                      {reservation.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 shrink-0 text-gray-400" />

                    <span className="text-gray-600">
                      {reservation.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 shrink-0 text-gray-400" />

                    <span className="text-gray-600">
                      {reservation.numberOfPeople} personne
                      {reservation.numberOfPeople !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 shrink-0 text-gray-400" />

                    <span className="text-gray-600">
                      {formatDate(reservation.createdAt)}
                    </span>
                  </div>

                  {reservation.message && (
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="break-words text-sm italic text-gray-500">
                        &quot;{reservation.message}&quot;
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <span className="text-sm font-medium text-gray-500">
                      Statut
                    </span>

                    <div className="relative">
                      <select
                        value={reservation.status}
                        onChange={(event) =>
                          void changeStatus(
                            reservation.id,
                            event.target.value as Reservation['status'],
                          )
                        }
                        className={`appearance-none rounded-full border-0 py-2 pl-3 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          statusStyles[reservation.status]
                        }`}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="cancelled">Annulée</option>
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Client
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Offre
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Personnes
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Statut
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filtered.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {reservation.fullName}
                        </p>

                        <p className="text-xs text-gray-400">
                          {reservation.email}
                        </p>

                        <p className="text-xs text-gray-400">
                          {reservation.phone}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="max-w-[220px] text-sm text-gray-700">
                          {reservation.packageTitle}
                        </p>

                        {reservation.message && (
                          <p
                            className="mt-1 max-w-[220px] truncate text-xs italic text-gray-400"
                            title={reservation.message}
                          >
                            &quot;{reservation.message}&quot;
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reservation.numberOfPeople}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(reservation.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={reservation.status}
                            onChange={(event) =>
                              void changeStatus(
                                reservation.id,
                                event.target
                                  .value as Reservation['status'],
                              )
                            }
                            className={`appearance-none rounded-full border-0 py-1.5 pl-3 pr-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              statusStyles[reservation.status]
                            }`}
                          >
                            {Object.entries(statusLabels).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ),
                            )}
                          </select>

                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2" />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            void removeReservation(reservation.id)
                          }
                          aria-label="Supprimer la réservation"
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}