'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Package as PackageIcon, ClipboardList, MessageSquare, TrendingUp, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Destination, Package, Reservation, ContactMessage } from '@/types';
import { getAllDestinations, getOffersCountByDestination } from '@/services/destinationsService';
import { getAllOffers } from '@/services/offersService';
import { getReservations } from '@/services/reservationsService';
import { getContactMessages } from '@/services/contactService';

export default function AdminDashboard() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [offerCounts, setOfferCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [destinationsData, offersData, reservationsData, messagesData] = await Promise.all([getAllDestinations(), getAllOffers(), getReservations(), getContactMessages()]);
        setDestinations(destinationsData);
        setPackages(offersData);
        setReservations(reservationsData);
        setMessages(messagesData);
        const counts: Record<string, number> = {};
        await Promise.all(destinationsData.map(async (destination) => {
          counts[destination.id] = await getOffersCountByDestination(destination.id);
        }));
        setOfferCounts(counts);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = [
    { label: 'Destinations', value: destinations.length, icon: MapPin, color: 'bg-blue-100 text-blue-600', href: '/admin/destinations' },
    { label: 'Offres', value: packages.length, icon: PackageIcon, color: 'bg-green-100 text-green-600', href: '/admin/offres' },
    { label: 'Réservations', value: reservations.length, icon: ClipboardList, color: 'bg-orange-100 text-orange-600', href: '/admin/reservations' },
    { label: 'Messages', value: messages.length, icon: MessageSquare, color: 'bg-purple-100 text-purple-600', href: '/admin/messages' },
  ];

  const pendingReservations = reservations.filter((r) => r.status === 'pending');
  const newMessages = messages.filter((m) => m.status === 'new');

  if (loading) return <p className="text-gray-500">Chargement du tableau de bord...</p>;

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord</h1><p className="text-gray-500 mt-1">Bienvenue dans l'espace d'administration Travelia</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">{stats.map((stat, i) => <Link key={i} href={stat.href} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-100"><div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}><stat.icon className="w-5 h-5" /></div><div className="text-3xl font-bold text-gray-900 mb-0.5">{stat.value}</div><div className="text-sm text-gray-500">{stat.label}</div></Link>)}</div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Réservations en attente" icon={Clock} count={pendingReservations.length} href="/admin/reservations" color="text-orange-500">
          {pendingReservations.length === 0 ? <Empty text="Aucune réservation en attente" /> : pendingReservations.slice(0, 3).map((r) => <Row key={r.id} title={r.fullName} subtitle={r.packageTitle} badge="En attente" />)}
        </Panel>
        <Panel title="Nouveaux messages" icon={MessageSquare} count={newMessages.length} href="/admin/messages" color="text-blue-500">
          {newMessages.length === 0 ? <Empty text="Aucun nouveau message" /> : newMessages.slice(0, 3).map((m) => <Row key={m.id} title={m.fullName} subtitle={m.subject} badge="Nouveau" />)}
        </Panel>
        <Panel title="Dernières offres" icon={TrendingUp} href="/admin/offres" color="text-green-500">
          {packages.slice(0, 3).map((pkg) => <Row key={pkg.id} title={pkg.title} subtitle={pkg.destination} value={`${pkg.price.toLocaleString('fr-FR')} ${pkg.currency}`} />)}
        </Panel>
        <Panel title="Destinations actives" icon={Users} href="/admin/destinations" color="text-purple-500">
          {destinations.slice(0, 4).map((dest) => <div key={dest.id} className="px-6 py-4 flex items-center justify-between"><div><p className="font-medium text-gray-900 text-sm">{dest.name}</p><p className="text-gray-500 text-xs mt-0.5">{dest.country}</p></div><div className="flex items-center gap-2"><span className="text-gray-500 text-xs">{offerCounts[dest.id] ?? 0} offres</span>{dest.isActive && <CheckCircle className="w-4 h-4 text-green-500" />}</div></div>)}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, count, href, color, children }: { title: string; icon: React.ElementType; count?: number; href: string; color: string; children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"><div className="flex items-center justify-between px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-900 flex items-center gap-2"><Icon className={`w-4 h-4 ${color}`} />{title}{typeof count === 'number' && <span className="bg-gray-100 text-gray-600 text-xs font-bold rounded-full px-2 py-0.5">{count}</span>}</h2><Link href={href} className="text-blue-600 text-xs hover:underline flex items-center gap-1">Voir tout <ArrowRight className="w-3 h-3" /></Link></div><div className="divide-y divide-gray-50">{children}</div></div>;
}
function Row({ title, subtitle, badge, value }: { title: string; subtitle: string; badge?: string; value?: string }) {
  return <div className="px-6 py-4 flex items-center justify-between"><div><p className="font-medium text-gray-900 text-sm">{title}</p><p className="text-gray-500 text-xs mt-0.5">{subtitle}</p></div>{badge && <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{badge}</span>}{value && <span className="text-blue-700 font-semibold text-sm">{value}</span>}</div>;
}
function Empty({ text }: { text: string }) { return <p className="text-center text-gray-400 text-sm py-8">{text}</p>; }
