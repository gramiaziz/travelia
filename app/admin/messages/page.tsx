'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronDown, Mail, Trash2 } from 'lucide-react';
import { ContactMessage } from '@/types';
import { deleteContactMessage, getContactMessages, updateContactMessageStatus } from '@/services/contactService';

const statusLabels: Record<ContactMessage['status'], string> = { new: 'Nouveau', read: 'Lu', replied: 'Répondu' };
const statusStyles: Record<ContactMessage['status'], string> = { new: 'bg-blue-100 text-blue-700', read: 'bg-gray-100 text-gray-600', replied: 'bg-green-100 text-green-700' };

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    try { setMessages(await getContactMessages()); }
    catch (error) { console.error('Erreur chargement messages:', error); }
    finally { setLoading(false); }
  }

  const filtered = messages.filter((m) => {
    const matchSearch = m.fullName.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const changeStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const updated = await updateContactMessageStatus(id, status);
      setMessages(messages.map((m) => m.id === id ? updated : m));
    } catch (error) {
      console.error('Erreur changement statut message:', error);
      alert('Erreur lors du changement de statut.');
    }
  };

  const removeMessage = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Erreur suppression message:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Messages de contact</h1><p className="text-gray-500 text-sm mt-1">{messages.length} messages au total</p></div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="">Tous les statuts</option><option value="new">Nouveau</option><option value="read">Lu</option><option value="replied">Répondu</option></select></div>
      <div className="grid grid-cols-3 gap-4 mb-6">{(['new', 'read', 'replied'] as const).map((s) => <div key={s} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"><div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${statusStyles[s]}`}>{statusLabels[s]}</div><div className="text-2xl font-bold text-gray-900">{messages.filter((m) => m.status === s).length}</div></div>)}</div>

      {loading ? <p className="text-gray-500">Chargement...</p> : <div className="space-y-3">{filtered.length === 0 && <div className="text-center py-12 bg-white rounded-2xl border border-gray-100"><Mail className="w-8 h-8 text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">Aucun message trouvé</p></div>}{filtered.map((msg) => <div key={msg.id} className={`bg-white rounded-2xl shadow-sm border transition-all ${msg.status === 'new' ? 'border-blue-200' : 'border-gray-100'}`}><div className="flex items-start justify-between p-5 cursor-pointer" onClick={() => { setExpanded(expanded === msg.id ? null : msg.id); if (msg.status === 'new') changeStatus(msg.id, 'read'); }}><div className="flex items-start gap-4"><div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-blue-600" /></div><div><div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-gray-900 text-sm">{msg.fullName}</p><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[msg.status]}`}>{statusLabels[msg.status]}</span></div><p className="text-gray-500 text-xs">{msg.email} · {msg.phone}</p><p className="text-gray-700 text-sm font-medium mt-1">{msg.subject}</p></div></div><div className="flex items-center gap-3 flex-shrink-0"><span className="text-gray-400 text-xs hidden sm:block">{new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span><ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`} /></div></div>{expanded === msg.id && <div className="px-5 pb-5 border-t border-gray-100 pt-4"><p className="text-gray-600 text-sm leading-relaxed mb-4 bg-gray-50 rounded-xl p-4">{msg.message}</p><div className="flex items-center gap-3 flex-wrap"><span className="text-sm text-gray-500">Changer le statut :</span><div className="relative"><select value={msg.status} onChange={(e) => changeStatus(msg.id, e.target.value as ContactMessage['status'])} className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-medium cursor-pointer border-0 focus:outline-none ${statusStyles[msg.status]}`}><option value="new">Nouveau</option><option value="read">Lu</option><option value="replied">Répondu</option></select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" /></div><button onClick={() => removeMessage(msg.id)} className="ml-auto inline-flex items-center gap-1 text-red-500 text-sm"><Trash2 className="w-4 h-4" />Supprimer</button></div></div>}</div>)}</div>}
    </div>
  );
}
