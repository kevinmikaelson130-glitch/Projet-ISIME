import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Eye, MessageSquare, Check, X, 
  Clock, Calendar, User, Mail, Phone, GraduationCap,
  ChevronDown, Send, MessageCircle
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

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  address: string;
  education_level: string;
  previous_school: string | null;
  program: string;
  status: string | null;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
}

export const AdminApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les candidatures',
        variant: 'destructive',
      });
    } else {
      setApplications(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  const handleOpenResponse = (application: Application) => {
    setSelectedApplication(application);
    setResponse(application.admin_response || '');
    setNewStatus(application.status || 'pending');
    setIsResponseOpen(true);
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove spaces, dashes, and other characters, keep only digits
    let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    // If starts with 0, replace with Madagascar country code
    if (cleaned.startsWith('0')) {
      cleaned = '261' + cleaned.substring(1);
    }
    // If doesn't start with +, assume it needs the + for international format
    if (!cleaned.startsWith('+') && !cleaned.startsWith('261')) {
      cleaned = '261' + cleaned;
    }
    return cleaned.replace('+', '');
  };

  const openWhatsApp = (phone: string, message: string) => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Try to open WhatsApp - if blocked, show a toast with a clickable link
    const newWindow = window.open(whatsappUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Pop-up was blocked, copy link to clipboard and show toast
      navigator.clipboard.writeText(whatsappUrl).then(() => {
        toast({
          title: 'Lien WhatsApp copié',
          description: 'Le pop-up a été bloqué. Le lien WhatsApp a été copié dans votre presse-papier.',
        });
      }).catch(() => {
        toast({
          title: 'Ouvrir WhatsApp manuellement',
          description: `Copiez ce lien: ${whatsappUrl}`,
        });
      });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedApplication) return;
    
    setIsSending(true);
    const { error } = await supabase
      .from('applications')
      .update({
        admin_response: response,
        status: newStatus,
        responded_at: new Date().toISOString(),
      })
      .eq('id', selectedApplication.id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la candidature',
        variant: 'destructive',
      });
    } else {
      // Open WhatsApp with the response message
      if (response.trim()) {
        openWhatsApp(selectedApplication.phone, response);
      }
      toast({
        title: 'Succès',
        description: 'La réponse a été enregistrée et WhatsApp ouvert',
      });
      setIsResponseOpen(false);
      fetchApplications();
    }
    setIsSending(false);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Accepté</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Refusé</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">En attente</Badge>;
    }
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
            placeholder="Rechercher par nom, email ou programme..."
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
            <SelectItem value="accepted">Accepté</SelectItem>
            <SelectItem value="rejected">Refusé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
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
              <p className="text-2xl font-bold">{applications.filter(a => a.status === 'accepted').length}</p>
              <p className="text-sm text-muted-foreground">Acceptées</p>
            </div>
          </div>
        </div>
        <div className="premium-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{applications.filter(a => a.status === 'rejected').length}</p>
              <p className="text-sm text-muted-foreground">Refusées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Candidat</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Programme</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Statut</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredApplications.map((application) => (
                  <motion.tr
                    key={application.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{application.first_name} {application.last_name}</p>
                        <p className="text-sm text-muted-foreground">{application.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{application.program}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(application.created_at), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(application)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenResponse(application)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Aucune candidature trouvée
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedApplication.first_name} {selectedApplication.last_name}
                    </h3>
                    <p className="text-muted-foreground">{selectedApplication.program}</p>
                  </div>
                </div>
                {getStatusBadge(selectedApplication.status)}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{selectedApplication.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium">{selectedApplication.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date de naissance</p>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedApplication.date_of_birth), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Niveau d'études</p>
                    <p className="text-sm font-medium">{selectedApplication.education_level}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Nationalité</p>
                  <p className="text-sm">{selectedApplication.nationality}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Adresse</p>
                  <p className="text-sm">{selectedApplication.address}</p>
                </div>
                {selectedApplication.previous_school && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">École précédente</p>
                    <p className="text-sm">{selectedApplication.previous_school}</p>
                  </div>
                )}
              </div>

              {selectedApplication.admin_response && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Réponse de l'administration</p>
                  <p className="text-sm">{selectedApplication.admin_response}</p>
                  {selectedApplication.responded_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Répondu le {format(new Date(selectedApplication.responded_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => handleOpenResponse(selectedApplication)}>
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
            <DialogTitle>Répondre à la candidature</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Candidat: <span className="font-medium text-foreground">{selectedApplication.first_name} {selectedApplication.last_name}</span>
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="accepted">Accepté</SelectItem>
                    <SelectItem value="rejected">Refusé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message de réponse</label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  rows={5}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsResponseOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSendResponse} disabled={isSending} className="bg-green-600 hover:bg-green-700">
                  {isSending ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Envoyer via WhatsApp
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
