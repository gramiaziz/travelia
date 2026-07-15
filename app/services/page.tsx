'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Plane, Hotel, FileCheck, Compass, Shield, Map, Car, ArrowRight, CheckCircle } from 'lucide-react';
import { Service } from '@/types';
import { getServices } from '@/services/servicesService';

const iconMap: Record<string, React.ElementType> = { Globe, Plane, Hotel, FileCheck, Compass, Shield, Map, Car };

const benefits = ['Réservation en ligne ou en agence', 'Assistance dédiée 7j/7', 'Prix transparents sans frais cachés', 'Accompagnement personnalisé'];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        setServices(await getServices());
      } catch (error) {
        console.error('Erreur chargement services:', error);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20"><Image src="https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" fill className="object-cover" /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3 block">Ce que nous offrons</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Nos services</h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">Une gamme complète de services de voyage pour répondre à toutes vos attentes.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500">Chargement des services...</p>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-400">Aucun service disponible actuellement.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Globe;
                return (
                  <div key={service.id} className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300"><Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" /></div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{service.description}</p>
                    <Link href="/contact" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors group/link">Demander ce service <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" /></Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl"><Image src="https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Service client" width={600} height={450} className="object-cover w-full h-auto" /></div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100"><div className="text-2xl font-bold text-blue-700">+500</div><div className="text-sm text-gray-500">Clients satisfaits</div></div>
            </div>
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Notre engagement</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-5">Des services à la hauteur de vos attentes</h2>
              <p className="text-gray-500 leading-relaxed mb-6">Chez Travelia, chaque service est conçu pour vous offrir la meilleure expérience possible.</p>
              <ul className="space-y-3 mb-8">{benefits.map((b, i) => <li key={i} className="flex items-center gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />{b}</li>)}</ul>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-md">Nous contacter <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
