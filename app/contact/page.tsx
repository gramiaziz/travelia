'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { createContactMessage } from '@/services/contactService';

const subjects = ['Demande d\'information', 'Réservation', 'Visa et documents', 'Omra', 'Réclamation', 'Autre'];

export default function ContactPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Nom obligatoire';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.phone.trim()) e.phone = 'Téléphone obligatoire';
    if (!form.subject) e.subject = 'Veuillez sélectionner un sujet';
    if (!form.message.trim()) e.message = 'Message obligatoire';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});
      await createContactMessage(form);
      setSubmitted(true);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      setErrors({ submit: "Une erreur s'est produite. Veuillez réessayer." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20"><Image src="https://images.pexels.com/photos/2097616/pexels-photo-2097616.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" fill className="object-cover" /></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3 block">Nous sommes là</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contactez-nous</h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">Notre équipe est disponible pour répondre à toutes vos questions et vous aider à planifier votre voyage.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h2>
              {[
                { icon: MapPin, title: 'Adresse', lines: ['Avenue Habib Bourguiba', 'Tunis, Tunisie'] },
                { icon: Phone, title: 'Téléphone', lines: ['+216 52 690 163'] },
                { icon: Mail, title: 'Email', lines: ['contact@travelia.tn'] },
                { icon: MessageSquare, title: 'WhatsApp', lines: ['+216 52 690 163'] },
                { icon: Clock, title: 'Horaires', lines: ['Lundi - Samedi', '09:00 - 18:00'] },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><item.icon className="w-5 h-5 text-blue-600" /></div>
                  <div><p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>{item.lines.map((line, j) => <p key={j} className="text-gray-600 text-sm">{line}</p>)}</div>
                </div>
              ))}
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 h-48 flex items-center justify-center">
                <div className="text-center"><MapPin className="w-10 h-10 text-blue-400 mx-auto mb-2" /><p className="text-blue-600 font-medium text-sm">Avenue Habib Bourguiba</p><p className="text-blue-400 text-xs">Tunis, Tunisie</p></div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Message envoyé !</h3>
                    <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.</p>
                    <button onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', phone: '', subject: '', message: '' }); }} className="mt-6 text-blue-600 hover:underline text-sm">Envoyer un autre message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errors.submit && <p className="text-red-500 text-sm bg-red-50 rounded-xl p-3">{errors.submit}</p>}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Nom complet *" error={errors.fullName}><input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Votre nom complet" className={inputClass(errors.fullName)} /></Field>
                      <Field label="Email *" error={errors.email}><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" className={inputClass(errors.email)} /></Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Téléphone *" error={errors.phone}><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+216 XX XXX XXX" className={inputClass(errors.phone)} /></Field>
                      <Field label="Sujet *" error={errors.subject}><select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass(errors.subject)}><option value="">Choisir un sujet</option>{subjects.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
                    </div>
                    <Field label="Message *" error={errors.message}><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Décrivez votre demande..." rows={5} className={`${inputClass(errors.message)} resize-none`} /></Field>
                    <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"><Send className="w-4 h-4" />{submitting ? 'Envoi...' : 'Envoyer le message'}</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-3.5 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-200'}`;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>{children}{error && <p className="text-red-500 text-xs mt-1">{error}</p>}</div>;
}
