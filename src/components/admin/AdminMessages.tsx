import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Eye, MessageSquare, Check, Clock,
  Mail, User, Send, Inbox, MessageCircle, Phone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCallback } from 'react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string | null;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
}

export const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les messages',
        variant: 'destructive',
      });
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);
  };

  const handleOpenResponse = (message: ContactMessage) => {
    setSelectedMessage(message);
    setResponse(message.admin_response || '');
    setIsResponseOpen(true);
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '261' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('+') && !cleaned.startsWith('261')) {
      cleaned = '261' + cleaned;
    }
    return cleaned.replace('+', '');
  };

  const openWhatsApp = (phone: string, message: string) => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Use a temporary <a> tag to navigate - works even when pop-ups are blocked
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendResponse = async () => {
    if (!selectedMessage) return;
    
    setIsSending(true);
    const { error } = await supabase
      .from('contact_messages')
      .update({
        admin_response: response,
        status: 'responded',
        responded_at: new Date().toISOString(),
      })
      .eq('id', selectedMessage.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le message',
        variant: 'destructive',
      });
    } else {
      // Open WhatsApp with the response message if phone is available
      if (response.trim() && selectedMessage.phone) {
        openWhatsApp(selectedMessage.phone, response);
      }
      toast({
        title: 'Succès',
        description: selectedMessage.phone 
          ? 'La réponse a été enregistrée et WhatsApp ouvert' 
          : 'La réponse a été enregistrée (pas de téléphone disponible)',
      });
      setIsResponseOpen(false);
      fetchMessages();
    }
    setIsSending(false);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'responded':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Répondu</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">En attente</Badge>;
    }
  };

  const getSubjectLabel = (subject: string) => {
    const subjects: Record<string, string> = {
      'admission': "Demande d'admission",
      'information': "Demande d'information",
      'visite': 'Visite du campus',
      'autre': 'Autre',
    };
    return subjects[subject] || subject;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email ou sujet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="responded">Répondu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === 'pending' || !m.status).length}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === 'responded').length}</p>
              <p className="text-sm text-muted-foreground">Répondus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="premium-card p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Inbox className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{message.name}</h3>
                      {getStatusBadge(message.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    <p className="text-sm font-medium mt-1">{getSubjectLabel(message.subject)}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(message.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(message)}
                    className="flex-1 sm:w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleOpenResponse(message)}
                    className="flex-1 sm:w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Répondre
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMessages.length === 0 && (
          <div className="premium-card p-8 text-center text-muted-foreground">
            <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun message trouvé</p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du message</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedMessage.name}</h3>
                    <p className="text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                </div>
                {getStatusBadge(selectedMessage.status)}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Sujet</p>
                <p className="font-medium">{getSubjectLabel(selectedMessage.subject)}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Message</p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                Reçu le {format(new Date(selectedMessage.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>

              {selectedMessage.admin_response && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Votre réponse</p>
                  <p className="whitespace-pre-wrap">{selectedMessage.admin_response}</p>
                  {selectedMessage.responded_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Répondu le {format(new Date(selectedMessage.responded_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => handleOpenResponse(selectedMessage)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Répondre
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Répondre au message</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  De: <span className="font-medium text-foreground">{selectedMessage.name}</span> ({selectedMessage.email})
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sujet: <span className="font-medium text-foreground">{getSubjectLabel(selectedMessage.subject)}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Votre réponse</label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  rows={6}
                />
              </div>

              {selectedMessage?.phone && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>La réponse sera envoyée via WhatsApp au {selectedMessage.phone}</span>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsResponseOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleSendResponse} 
                  disabled={isSending || !response.trim()}
                  className={selectedMessage?.phone ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {isSending ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Envoi...
                    </>
                  ) : (
                    <>
                      {selectedMessage?.phone ? (
                        <MessageCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {selectedMessage?.phone ? 'Envoyer via WhatsApp' : 'Enregistrer'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
