'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Users, Globe, Award, Shield, Plane, CheckCircle, ChevronRight, MapPin, Clock, TrendingUp, Calendar } from 'lucide-react';
import { Destination, Package, Service } from '@/types';
import { getDestinations, getOffersCountByDestination, formatOffersCount } from '@/services/destinationsService';
import { getOffers } from '@/services/offersService';
import { getServices } from '@/services/servicesService';

const stats = [
  { icon: Users, value: '+500', label: 'Clients satisfaits' },
  { icon: Globe, value: '+30', label: 'Destinations' },
  { icon: Plane, value: '+100', label: 'Voyages organisés' },
  { icon: Clock, value: '7j/7', label: 'Assistance' },
];

const testimonials = [
  { name: 'Ahmed Ben Salem', location: 'Tunis', rating: 5, text: "Un voyage à Istanbul absolument magnifique ! L'équipe de Travelia a tout organisé à la perfection.", avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Fatima Khelil', location: 'Sfax', rating: 5, text: 'Notre séjour à Dubaï était de rêve. Hôtel exceptionnel, guide formidable, tout était parfait.', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Mohamed Trabelsi', location: 'Sousse', rating: 5, text: 'Notre Omra avec Travelia était une expérience spirituelle inoubliable.', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

const whyChooseUs = [
  { icon: Shield, title: 'Agence certifiée', desc: 'Agence de voyage agréée avec toutes les certifications officielles.' },
  { icon: Users, title: 'Accompagnement personnalisé', desc: 'Notre équipe vous accompagne avant, pendant et après votre voyage.' },
  { icon: Award, title: 'Meilleurs prix garantis', desc: 'Nous vous offrons les meilleurs tarifs du marché sans compromis sur la qualité.' },
  { icon: Globe, title: '+30 destinations', desc: 'Un large choix de destinations pour tous les goûts et tous les budgets.' },
  { icon: CheckCircle, title: 'Satisfaction garantie', desc: 'Plus de 500 clients satisfaits témoignent de la qualité de nos services.' },
  { icon: TrendingUp, title: 'Expertise depuis 10 ans', desc: "Une décennie d'expérience dans le tourisme et l'organisation de voyages." },
];

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [offerCounts, setOfferCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [destinationsData, offersData, servicesData] = await Promise.all([getDestinations(), getOffers(), getServices()]);
        setDestinations(destinationsData);
        setPackages(offersData);
        setServices(servicesData);
        const counts: Record<string, number> = {};
        await Promise.all(destinationsData.map(async (destination) => {
          counts[destination.id] = await getOffersCountByDestination(destination.id);
        }));
        setOfferCounts(counts);
      } catch (error) {
        console.error('Erreur chargement accueil:', error);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Voyage" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-blue-900/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"><Globe className="w-4 h-4 text-orange-400" /><span className="text-white/90 text-sm font-medium">Agence de voyage en Tunisie</span></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">Découvrez le monde <span className="text-orange-400">avec Travelia</span></h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">Trouvez les meilleures destinations, offres de voyage et séjours organisés au meilleur prix.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/offres" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">Voir les offres <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">Nous contacter</Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid grid-cols-2 lg:grid-cols-4 gap-8">{stats.map((stat, i) => <div key={i} className="text-center"><div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3"><stat.icon className="w-6 h-6 text-white" /></div><div className="text-3xl font-bold text-white mb-1">{stat.value}</div><div className="text-blue-200 text-sm">{stat.label}</div></div>)}</div></div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Explorez" title="Destinations populaires" text="Découvrez nos destinations les plus prisées et laissez-vous inspirer pour votre prochain voyage." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((dest) => {
              const count = offerCounts[dest.id] ?? 0;
              return (
                <Link key={dest.id} href={count > 0 ? `/offres?destinationId=${dest.id}` : '/destinations'} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] relative"><Image src={dest.imageUrl || 'https://images.pexels.com/photos/2104792/pexels-photo-2104792.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" /></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5"><div className="flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5 text-orange-400" /><span className="text-orange-300 text-xs">{dest.country}</span></div><h3 className="text-white font-bold text-xl">{dest.name}</h3><div className="flex items-center justify-between mt-2"><span className="text-white/70 text-sm">{formatOffersCount(count)}</span><span className="flex items-center gap-1 text-orange-400 text-sm font-medium group-hover:gap-2 transition-all">Explorer <ChevronRight className="w-4 h-4" /></span></div></div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10"><Link href="/destinations" className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200">Voir toutes les destinations <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Offres spéciales" title="Offres promotionnelles" text="Profitez de nos meilleures offres de voyage à des prix exceptionnels." orange />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.slice(0, 3).map((pkg) => <OfferCard key={pkg.id} pkg={pkg} />)}
          </div>
          <div className="text-center mt-10"><Link href="/offres" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-md">Voir toutes les offres <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Services" title="Nos services principaux" text="Travelia vous accompagne dans toutes les étapes de votre voyage." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{services.slice(0, 4).map((service) => <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><Globe className="w-6 h-6 text-blue-600" /></div><h3 className="font-bold text-gray-900 mb-2">{service.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{service.description}</p></div>)}</div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Pourquoi nous choisir" title="Une agence qui prend soin de votre voyage" text="Nous mettons notre expérience et notre sérieux au service de vos projets de voyage." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{whyChooseUs.map((item, i) => <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"><item.icon className="w-8 h-8 text-blue-600 mb-4" /><h3 className="font-bold text-gray-900 mb-2">{item.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p></div>)}</div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Avis clients" title="Ils nous font confiance" text="Découvrez quelques témoignages de nos clients satisfaits." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{testimonials.map((t) => <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"><div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />)}</div><p className="text-gray-600 text-sm leading-relaxed mb-5">“{t.text}”</p><div className="flex items-center gap-3"><Image src={t.avatar} alt={t.name} width={42} height={42} className="rounded-full object-cover" /><div><p className="font-semibold text-gray-900 text-sm">{t.name}</p><p className="text-gray-400 text-xs">{t.location}</p></div></div></div>)}</div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text, orange }: { eyebrow: string; title: string; text: string; orange?: boolean }) {
  return <div className="text-center mb-12"><span className={`${orange ? 'text-orange-500' : 'text-blue-600'} font-semibold text-sm uppercase tracking-wider`}>{eyebrow}</span><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">{title}</h2><p className="text-gray-500 max-w-xl mx-auto">{text}</p></div>;
}

function OfferCard({ pkg }: { pkg: Package }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden"><Image src={pkg.imageUrl || 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide capitalize">{pkg.type}</div></div>
      <div className="p-5"><h3 className="font-bold text-gray-900 text-lg mb-2">{pkg.title}</h3><p className="text-gray-500 text-sm mb-3 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" />{pkg.destination}</p><div className="flex items-center gap-4 text-sm text-gray-500 mb-4"><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.durationDays}j / {pkg.durationNights}n</span><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{pkg.departureDate ? new Date(pkg.departureDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'À définir'}</span></div><div className="flex items-center justify-between pt-4 border-t border-gray-100"><div><span className="text-xs text-gray-400 block">À partir de</span><span className="text-xl font-bold text-blue-700">{pkg.price.toLocaleString('fr-FR')} {pkg.currency}</span></div><Link href={`/offres/${pkg.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Détails</Link></div></div>
    </div>
  );
}
