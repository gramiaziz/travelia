'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Clock, Calendar, Users, CheckCircle, XCircle, ChevronLeft, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { Package } from '@/types';
import { getOfferById } from '@/services/offersService';
import { createReservation } from '@/services/reservationsService';

export default function OfferDetailPage() {
  const params = useParams();
  const offerId = String(params.id);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', numberOfPeople: '1', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadOffer() {
      try {
        const data = await getOfferById(offerId);
        setPkg(data);
      } catch (error) {
        console.error('Erreur chargement offre:', error);
        setPkg(null);
      } finally {
        setLoading(false);
      }
    }

    loadOffer();
  }, [offerId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Nom obligatoire';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.phone.trim()) e.phone = 'Téléphone obligatoire';
    if (Number(form.numberOfPeople) < 1) e.numberOfPeople = 'Nombre de personnes invalide';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      setSubmitting(true);
      setErrors({});
      await createReservation({
        packageId: pkg.id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        numberOfPeople: Number(form.numberOfPeople),
        message: form.message,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Erreur envoi réservation:', error);
      setErrors({ submit: "Une erreur s'est produite. Veuillez réessayer." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-gray-500">Chargement de l'offre...</p></div>;
  }

  if (!pkg) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Offre introuvable</h1>
          <Link href="/offres" className="text-blue-600 hover:underline">Retour aux offres</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <Link href="/offres" className="hover:text-blue-600 transition-colors">Offres</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-gray-900 font-medium truncate">{pkg.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg">
              <Image src={pkg.imageUrl || 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={pkg.title} fill className="object-cover" priority />
              {pkg.type && <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full capitalize">{pkg.type}</div>}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Clock, label: 'Durée', value: `${pkg.durationDays}j / ${pkg.durationNights}n` },
                { icon: Calendar, label: 'Départ', value: pkg.departureDate ? new Date(pkg.departureDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'À définir' },
                { icon: Users, label: 'Places', value: `${pkg.availablePlaces} places` },
                { icon: MapPin, label: 'Destination', value: pkg.destination || 'À définir' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <item.icon className="w-5 h-5 text-blue-600 mb-2" />
                  <span className="text-xs text-gray-400 mb-0.5">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{pkg.title}</h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-5"><MapPin className="w-4 h-4 text-blue-500" />{pkg.destination}</div>
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Programme jour par jour</h2>
              {!pkg.program || pkg.program.length === 0 ? (
                <p className="text-gray-400 text-sm italic">Aucun programme détaillé n'a encore été ajouté pour cette offre.</p>
              ) : (
                <div className="space-y-4">
                  {[...pkg.program].sort((a, b) => a.dayNumber - b.dayNumber).map((step, i, arr) => (
                    <div key={`${step.dayNumber}-${i}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{step.dayNumber}</div>
                        {i < arr.length - 1 && <div className="w-0.5 bg-blue-200 flex-1 mt-2" />}
                      </div>
                      <div className="pb-4 flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" />Ce qui est inclus</h2>
                {pkg.included.length === 0 ? <p className="text-sm text-gray-400 italic">Non renseigné</p> : <ul className="space-y-2">{pkg.included.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />{item}</li>)}</ul>}
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" />Non inclus</h2>
                {pkg.notIncluded.length === 0 ? <p className="text-sm text-gray-400 italic">Non renseigné</p> : <ul className="space-y-2">{pkg.notIncluded.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />{item}</li>)}</ul>}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Conditions importantes</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {['Le paiement d\'un acompte de 30% est requis à la réservation.', 'Le solde doit être réglé au moins 15 jours avant le départ.', 'Annulation gratuite jusqu\'à 30 jours avant le départ.'].map((text) => (
                  <li key={text} className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />{text}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <span className="text-gray-400 text-sm">À partir de</span>
                <div className="text-4xl font-bold text-blue-700">{pkg.price.toLocaleString('fr-FR')} <span className="text-xl">{pkg.currency}</span></div>
                <p className="text-gray-400 text-sm">par personne</p>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Demande envoyée !</h3>
                  <p className="text-gray-500 text-sm mb-5">Notre agence vous contactera bientôt.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', phone: '', numberOfPeople: '1', message: '' }); }} className="text-blue-600 hover:underline text-sm">Envoyer une autre demande</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-4">Demande de réservation</h3>
                  {errors.submit && <p className="text-red-500 text-sm bg-red-50 rounded-xl p-3">{errors.submit}</p>}
                  <div><input type="text" placeholder="Nom complet *" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={`w-full px-3.5 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-400' : 'border-gray-200'}`} />{errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}</div>
                  <div><input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full px-3.5 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
                  <div><input type="tel" placeholder="Téléphone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`w-full px-3.5 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} />{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}</div>
                  <div><input type="number" min="1" placeholder="Nombre de personnes" value={form.numberOfPeople} onChange={(e) => setForm({ ...form, numberOfPeople: e.target.value })} className={`w-full px-3.5 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.numberOfPeople ? 'border-red-400' : 'border-gray-200'}`} />{errors.numberOfPeople && <p className="text-red-500 text-xs mt-1">{errors.numberOfPeople}</p>}</div>
                  <textarea placeholder="Message optionnel" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  <button type="submit" disabled={submitting} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                    <Send className="w-4 h-4" />{submitting ? 'Envoi...' : 'Envoyer la demande'}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
