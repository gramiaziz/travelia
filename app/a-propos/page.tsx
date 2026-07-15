import Image from 'next/image';
import Link from 'next/link';
import { Users, Globe, Plane, Clock, Target, Heart, Shield, Award, ArrowRight } from 'lucide-react';

const stats = [
  { icon: Users, value: '+500', label: 'Clients satisfaits', color: 'bg-blue-100 text-blue-600' },
  { icon: Globe, value: '+30', label: 'Destinations', color: 'bg-orange-100 text-orange-600' },
  { icon: Plane, value: '+100', label: 'Voyages organisés', color: 'bg-green-100 text-green-600' },
  { icon: Clock, value: '7j/7', label: 'Assistance', color: 'bg-purple-100 text-purple-600' },
];

const values = [
  { icon: Target, title: 'Excellence', desc: 'Nous visons l\'excellence dans chaque aspect de nos services pour vous offrir le meilleur.' },
  { icon: Heart, title: 'Passion', desc: 'Nous sommes passionnés par le voyage et par l\'art de créer des expériences mémorables.' },
  { icon: Shield, title: 'Confiance', desc: 'La transparence et l\'honnêteté sont au cœur de notre relation avec chaque client.' },
  { icon: Award, title: 'Expertise', desc: 'Plus de 10 ans d\'expérience dans le tourisme pour garantir la qualité de vos voyages.' },
];

const team = [
  {
    name: 'Sami Khalfallah',
    role: 'Directeur général',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Nour Ben Amor',
    role: 'Responsable des voyages',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    name: 'Yassine Dridi',
    role: 'Conseiller voyage senior',
    image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="relative py-24 bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3 block">Qui sommes-nous</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">À propos de Travelia</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Votre partenaire de confiance pour des voyages organisés, mémorables et accessibles.
          </p>
        </div>
      </section>

      {/* About content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Notre histoire</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Votre voyage, notre passion
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Travelia est une agence de voyage spécialisée dans l'organisation de séjours touristiques, voyages de groupe, Omra, assistance visa et réservations personnalisées. Fondée il y a plus de 10 ans, notre agence est devenue une référence dans le secteur du tourisme en Tunisie.
                </p>
                <p>
                  Notre mission est d'accompagner nos clients avant, pendant et après leur voyage afin de leur offrir une expérience simple, sécurisée et agréable. Chaque voyage est une aventure unique que nous planifions avec soin et dévotion.
                </p>
                <p>
                  Nous travaillons en partenariat avec les meilleurs hôtels, compagnies aériennes et guides locaux à travers le monde pour vous garantir des séjours de qualité exceptionnelle.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="À propos de Travelia"
                  width={600}
                  height={500}
                  className="object-cover w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm text-blue-100">Années d'expérience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Ce qui nous guide</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">Nos valeurs</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Des valeurs qui reflètent notre engagement envers nos clients et notre amour du voyage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Notre équipe</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">Les visages de Travelia</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="relative aspect-[1/1] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à voyager avec nous ?</h2>
          <p className="text-blue-200 mb-8">
            Contactez notre équipe et nous vous préparerons le voyage de vos rêves.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg"
          >
            Nous contacter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
