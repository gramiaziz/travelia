'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { Destination } from '@/types';
import { getDestinations, getOffersCountByDestination, formatOffersCount } from '@/services/destinationsService';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [offerCounts, setOfferCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const destinationsData = await getDestinations();
        setDestinations(destinationsData);
        const counts: Record<string, number> = {};
        await Promise.all(destinationsData.map(async (destination) => {
          counts[destination.id] = await getOffersCountByDestination(destination.id);
        }));
        setOfferCounts(counts);
      } catch (error) {
        console.error('Erreur chargement destinations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const countries = Array.from(new Set(destinations.map((d) => d.country)));
  const filtered = destinations.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    const matchCountry = !selectedCountry || d.country === selectedCountry;
    return matchSearch && matchCountry;
  });

  const hasFilters = !!selectedCountry;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-500">Chargement des destinations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.pexels.com/photos/2104792/pexels-photo-2104792.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3 block">Explorez</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Nos destinations</h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">Découvrez toutes nos destinations et trouvez celle qui correspond à vos envies de voyage.</p>
        </div>
      </section>

      <section className="sticky top-16 lg:top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Rechercher une destination ou un pays..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters || hasFilters ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600'}`}>
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64">
                <option value="">Tous les pays</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {hasFilters && (
            <button onClick={() => setSelectedCountry('')} className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
              Effacer les filtres
            </button>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 text-sm mb-8"><span className="font-semibold text-gray-900">{filtered.length}</span> destination{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><MapPin className="w-7 h-7 text-gray-400" /></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune destination trouvée</h3>
              <p className="text-gray-500 text-sm">Essayez de modifier votre recherche ou vos filtres.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((dest) => {
                const count = offerCounts[dest.id] ?? 0;
                return (
                  <div key={dest.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={dest.imageUrl || 'https://images.pexels.com/photos/2104792/pexels-photo-2104792.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-medium text-gray-800">{dest.country}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{dest.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{dest.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${count === 0 ? 'text-gray-400' : 'text-blue-600'}`}>{formatOffersCount(count)}</span>
                        {count > 0 ? (
                          <Link href={`/offres?destinationId=${dest.id}`} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                            Voir les offres <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Bientôt disponible</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
