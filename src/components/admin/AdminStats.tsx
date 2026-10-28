import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  FileText, Clock, Check, X, MessageSquare, TrendingUp, CalendarDays, ArrowRight, RefreshCw,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
} from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import {
  computeApplicationStats, computeMessageStats, StatsApplication, StatsMessage,
} from '@/lib/adminStats';

const statusChartConfig = {
  pending: { label: 'En attente', color: 'hsl(var(--status-pending))' },
  accepted: { label: 'Acceptées', color: 'hsl(var(--status-accepted))' },
  rejected: { label: 'Refusées', color: 'hsl(var(--status-rejected))' },
} satisfies ChartConfig;

const monthChartConfig = {
  count: { label: 'Candidatures', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;

interface AdminStatsProps {
  onOpenApplications: () => void;
  onOpenMessages: () => void;
}

export const AdminStats = ({ onOpenApplications, onOpenMessages }: AdminStatsProps) => {
  const [applications, setApplications] = useState<StatsApplication[]>([]);
  const [messages, setMessages] = useState<StatsMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setIsLoading(true);
    const [apps, msgs] = await Promise.all([
      supabase
        .from('applications')
        .select('id, first_name, last_name, tracking_code, program, education_level, status, created_at'),
      supabase.from('contact_messages').select('status'),
    ]);
    if (apps.error || msgs.error) {
      console.error('Stats error:', apps.error ?? msgs.error);
      toast({ title: 'Erreur', description: 'Impossible de charger les statistiques', variant: 'destructive' });
    } else {
      setApplications(apps.data ?? []);
      setMessages(msgs.data ?? []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => computeApplicationStats(applications), [applications]);
  const msgStats = useMemo(() => computeMessageStats(messages), [messages]);

  const monthData = stats.byMonth.map((m) => {
    const [y, mo] = m.month.split('-').map(Number);
    return { ...m, label: format(new Date(y, mo - 1, 1), 'MMM yy', { locale: fr }) };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const kpis = [
    { label: 'Candidatures reçues', value: stats.total, icon: FileText, tone: 'bg-primary/10 text-primary' },
    { label: 'Dossiers à traiter', value: stats.pending, icon: Clock, tone: 'bg-status-pending/15 text-status-pending' },
    { label: 'Acceptées', value: stats.accepted, icon: Check, tone: 'bg-status-accepted/15 text-status-accepted' },
    { label: 'Refusées', value: stats.rejected, icon: X, tone: 'bg-status-rejected/15 text-status-rejected' },
    {
      label: "Taux d'acceptation",
      value: stats.acceptanceRate === null ? '—' : `${stats.acceptanceRate} %`,
      hint: 'parmi les dossiers traités',
      icon: TrendingUp,
      tone: 'bg-secondary/10 text-secondary dark:text-secondary-foreground',
    },
    { label: 'Ce mois-ci', value: stats.thisMonth, hint: 'nouvelles candidatures', icon: CalendarDays, tone: 'bg-primary/10 text-primary' },
    {
      label: 'Messages sans réponse',
      value: msgStats.pending,
      hint: `sur ${msgStats.total} message(s)`,
      icon: MessageSquare,
      tone: 'bg-status-pending/15 text-status-pending',
      onClick: onOpenMessages,
    },
  ];

  const maxLevel = Math.max(1, ...stats.byEducationLevel.map((l) => l.count));

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Key figures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const content = (
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${k.tone}`}>
                <k.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold leading-tight">{k.value}</p>
                <p className="text-sm text-muted-foreground">{k.label}</p>
                {k.hint && <p className="text-xs text-muted-foreground/80">{k.hint}</p>}
              </div>
            </div>
          );
          return k.onClick ? (
            <button
              key={k.label}
              onClick={k.onClick}
              className="premium-card p-4 text-left hover:ring-2 hover:ring-primary/30 transition-shadow"
            >
              {content}
            </button>
          ) : (
            <div key={k.label} className="premium-card p-4">{content}</div>
          );
        })}
      </div>

      {stats.total === 0 ? (
        <div className="premium-card p-8 text-center text-muted-foreground">
          Aucune candidature pour l'instant : les graphiques apparaîtront dès la première.
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* By program */}
            <section className="premium-card p-5">
              <h2 className="font-semibold mb-1">Candidatures par programme</h2>
              <p className="text-sm text-muted-foreground mb-4">Répartition selon le statut du dossier</p>
              <ChartContainer config={statusChartConfig} className="aspect-auto h-[280px] w-full">
                <BarChart data={stats.byProgram} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="program"
                    width={140}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="pending" stackId="s" fill="var(--color-pending)" />
                  <Bar dataKey="accepted" stackId="s" fill="var(--color-accepted)" />
                  <Bar dataKey="rejected" stackId="s" fill="var(--color-rejected)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </section>

            {/* By month */}
            <section className="premium-card p-5">
              <h2 className="font-semibold mb-1">Candidatures par mois</h2>
              <p className="text-sm text-muted-foreground mb-4">Les 6 derniers mois</p>
              <ChartContainer config={monthChartConfig} className="aspect-auto h-[280px] w-full">
                <BarChart data={monthData} margin={{ top: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </section>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Oldest pending */}
            <section className="premium-card p-5">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-semibold mb-1">Dossiers qui attendent le plus</h2>
                  <p className="text-sm text-muted-foreground">Les plus anciennes candidatures sans décision</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onOpenApplications}>
                  Traiter
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              {stats.oldestPending.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tous les dossiers ont reçu une décision.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {stats.oldestPending.map((a) => (
                    <li key={a.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{a.first_name} {a.last_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {a.program}
                          {a.tracking_code && <span className="font-mono text-primary"> · {a.tracking_code}</span>}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-status-pending/15 text-status-pending shrink-0">
                        {a.daysWaiting === 0 ? "Aujourd'hui" : `${a.daysWaiting} jour${a.daysWaiting > 1 ? 's' : ''}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Education levels */}
            <section className="premium-card p-5">
              <h2 className="font-semibold mb-1">Niveau d'études des candidats</h2>
              <p className="text-sm text-muted-foreground mb-4">Diplôme le plus élevé déclaré</p>
              <ul className="space-y-3">
                {stats.byEducationLevel.map((l) => (
                  <li key={l.level}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{l.level}</span>
                      <span className="font-medium">
                        {l.count} <span className="text-muted-foreground font-normal">({Math.round((l.count / stats.total) * 100)} %)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(l.count / maxLevel) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
};
