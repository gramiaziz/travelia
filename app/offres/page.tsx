'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Clock, Plane, SlidersHorizontal, X, Calendar, ArrowLeft } from 'lucide-react';
import { Destination, Package } from '@/types';
import { getOffers, getOffersByDestination } from '@/services/offersService';
import { getDestinationById } from '@/services/destinationsService';

const typeOptions = [
  { label: 'Tous types', value: '' },
  { label: 'Culturel', value: 'culturel' },
  { label: 'Balnéaire', value: 'balnéaire' },
  { label: 'Luxe', value: 'luxe' },
  { label: 'Omra', value: 'omra' },
  { label: 'Romantique', value: 'romantique' },
];

const priceOptions = [
  { label: 'Tous prix', value: '' },
  { label: 'Moins de 1000 TND', value: 'low' },
  { label: '1000 - 2500 TND', value: 'mid' },
  { label: 'Plus de 2500 TND', value: 'high' },
];

const durationOptions = [
  { label: 'Toutes durées', value: '' },
  { label: 'Court séjour (1-4 jours)', value: 'short' },
  { label: 'Semaine (5-7 jours)', value: 'week' },
  { label: 'Long séjour (8+ jours)', value: 'long' },
];

export default function OffresPage() {
  const searchParams = useSearchParams();
  const destinationId = searchParams.get('destinationId') ?? '';

  const [offers, setOffers] = useState<Package[]>([]);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadOffers() {
      try {
        setLoading(true);
        setSearch('');
        setSelectedType('');
        setSelectedPrice('');
        setSelectedDuration('');

        if (destinationId) {
          const [offersData, destinationData] = await Promise.all([
            getOffersByDestination(destinationId),
            getDestinationById(destinationId),
          ]);
          setOffers(offersData);
          setDestination(destinationData);
        } else {
          const offersData = await getOffers();
          setOffers(offersData);
          setDestination(null);
        }
      } catch (error) {
        console.error('Erreur chargement offres:', error);
        setOffers([]);
        setDestination(null);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, [destinationId]);

  const filtered = offers.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.destination.toLowerCase().includes(search.toLowerCase());
    const matchType = !selectedType || p.type === selectedType;
    const matchPrice = !selectedPrice || (selectedPrice === 'low' && p.price < 1000) || (selectedPrice === 'mid' && p.price >= 1000 && p.price <= 2500) || (selectedPrice === 'high' && p.price > 2500);
    const matchDuration = !selectedDuration || (selectedDuration === 'short' && p.durationDays <= 4) || (selectedDuration === 'week' && p.durationDays >= 5 && p.durationDays <= 7) || (selectedDuration === 'long' && p.durationDays >= 8);
    return matchSearch && matchType && matchPrice && matchDuration;
  });

  const hasFilters = !!(selectedType || selectedPrice || selectedDuration);
  const clearFilters = () => {
    setSelectedType('');
    setSelectedPrice('');
    setSelectedDuration('');
  };

  const pageTitle = destination ? `Offres disponibles pour ${destination.name}` : 'Nos offres & packages';
  const pageSubtitle = destination ? `${destination.name}, ${destination.country} — choisissez parmi nos voyages organisés.` : 'Choisissez parmi nos voyages organisés, séjours et forfaits au meilleur prix.';

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-gray-500">Chargement des offres...</p></div>;
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={destination?.imageUrl || 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=1920'} alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {destination && (
            <Link href="/destinations" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour aux destinations
            </Link>
          )}
          <span className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3 block">{destination ? destination.country : 'Voyages'}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{pageTitle}</h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">{pageSubtitle}</p>
        </div>
      </section>

      <section className="sticky top-16 lg:top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {destination && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 text-sm font-medium">
                <MapPin className="w-3.5 h-3.5" /> {destination.name}, {destination.country}
                <Link href="/offres" className="ml-1 text-blue-400 hover:text-blue-700 transition-colors"><X className="w-3.5 h-3.5" /></Link>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={destination ? `Rechercher dans ${destination.name}...` : 'Rechercher une offre ou destination...'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters || hasFilters ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600'}`}>
              <SlidersHorizontal className="w-4 h-4" /> Filtres
            </button>
          </div>
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{typeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select>
              <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{priceOptions.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select>
              <select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{durationOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select>
            </div>
          )}
          {hasFilters && <button onClick={clearFilters} className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" />Effacer les filtres</button>}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 text-sm mb-8"><span className="font-semibold text-gray-900">{filtered.length}</span> offre{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}{destination && <span className="text-gray-400"> pour {destination.name}</span>}</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Plane className="w-7 h-7 text-gray-400" /></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{destination ? `Aucune offre disponible actuellement pour ${destination.name}` : 'Aucune offre trouvée'}</h3>
              <p className="text-gray-500 text-sm mb-5">{destination ? 'Cette destination sera bientôt disponible.' : 'Essayez de modifier votre recherche ou vos filtres.'}</p>
              {destination && <Link href="/offres" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"><ArrowLeft className="w-4 h-4" />Voir toutes les offres</Link>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={pkg.imageUrl || 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide capitalize">{pkg.type}</div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">{pkg.availablePlaces} places</div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2">{pkg.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3"><MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /><span className="truncate">{pkg.destination}</span></div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" />{pkg.durationDays}j / {pkg.durationNights}n</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-400" />{pkg.departureDate ? new Date(pkg.departureDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'À définir'}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                      <div><span className="text-xs text-gray-400 block">À partir de</span><span className="text-2xl font-bold text-blue-700">{pkg.price.toLocaleString('fr-FR')} <span className="text-base font-semibold">{pkg.currency}</span></span></div>
                      <Link href={`/offres/${pkg.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">Voir détails</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
