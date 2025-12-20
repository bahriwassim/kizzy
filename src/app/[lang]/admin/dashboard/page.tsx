
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Euro, Users, Ticket, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import React from "react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { Input } from "@/components/ui/input"

type DailyRevenue = { name: string; revenue: number }
type InventoryRow = { tier: string; capacity: number | null; sold_count: number | null }
type PromoRow = { redemptions: number | null }

function formatDayLabel(date: Date) {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  return days[date.getDay()]
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [ticketsSold, setTicketsSold] = React.useState(0)
  const [popularSection, setPopularSection] = React.useState<string>('-')
  const [popularShare, setPopularShare] = React.useState<number>(0)
  const [promosUsed, setPromosUsed] = React.useState(0)
  const [weeklyRevenue, setWeeklyRevenue] = React.useState<DailyRevenue[]>([])
  const [totalRevenue, setTotalRevenue] = React.useState<number>(0)
  const [revenueGrowth, setRevenueGrowth] = React.useState<number>(0)

  const handleExport = () => {
    toast({
      title: "Fonctionnalité non disponible",
      description: "La fonction d'exportation n'est pas encore implémentée.",
    })
  }

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/dashboard/metrics', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Server error')
        setTicketsSold(json?.ticketsSold || 0)
        setPopularSection(json?.popularSection || '-')
        setPopularShare(json?.popularShare || 0)
        setPromosUsed(json?.promosUsed || 0)
        setTotalRevenue(Number(json?.totalRevenue || 0))
        setRevenueGrowth(Number(json?.revenueGrowth || 0))
        const daysMap: Record<string, string> = { Sun: 'Dim', Mon: 'Lun', Tue: 'Mar', Wed: 'Mer', Thu: 'Jeu', Fri: 'Ven', Sat: 'Sam' }
        const weekly: DailyRevenue[] = (json?.weeklyRevenue || []).map((d: any) => ({ name: daysMap[d.name] || d.name, revenue: d.revenue }))
        setWeeklyRevenue(weekly)
      } catch (e) {
        toast({ variant: 'destructive', title: 'Échec du chargement', description: 'Impossible de charger les données réelles.' })
      }
    })()
  }, [])

  return (
    <Tabs defaultValue="7days" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="font-headline text-3xl font-bold">Tableau de bord</h1>
                <p className="text-muted-foreground">Suivez les ventes, mesurez les performances et obtenez des informations.</p>
            </div>
            <div className="flex items-center gap-2">
                <TabsList>
                    <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
                    <TabsTrigger value="7days">7 jours</TabsTrigger>
                    <TabsTrigger value="30days">30 jours</TabsTrigger>
                </TabsList>
                <Button onClick={handleExport}>Exporter</Button>
                <div className="flex items-center gap-2">
                  <Input placeholder="email de test" id="smtp-test-email" />
                  <Button
                    onClick={async () => {
                      const input = document.getElementById('smtp-test-email') as HTMLInputElement | null
                      const to = input?.value || ''
                      if (!to) {
                        toast({ variant: 'destructive', title: 'Adresse manquante', description: 'Renseignez un e-mail pour le test SMTP.' })
                        return
                      }
                      try {
                        const res = await fetch('/api/payments/workbench/send-test', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ to }),
                        })
                        const j = await res.json().catch(() => ({} as any))
                        if (res.ok) {
                          toast({ title: 'E-mail envoyé', description: `Vérifiez ${to}` })
                        } else {
                          toast({ variant: 'destructive', title: 'Échec SMTP', description: j?.error || 'Erreur inconnue' })
                        }
                      } catch (err: any) {
                        toast({ variant: 'destructive', title: 'Erreur', description: err?.message || 'Échec de l’envoi SMTP' })
                      }
                    }}
                  >
                    Test SMTP
                  </Button>
                </div>
            </div>
        </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu (7 jours)</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}% vs période précédente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billets Vendus</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketsSold}</div>
            <p className="text-xs text-muted-foreground">Total billets émis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Section Populaire</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popularSection}</div>
            <p className="text-xs text-muted-foreground">{popularShare}% des ventes totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promos Utilisées</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promosUsed}</div>
            <p className="text-xs text-muted-foreground">Utilisations cumulées des codes</p>
          </CardContent>
        </Card>
      </div>
      
      <TabsContent value="7days">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendances des Ventes</CardTitle>
            <CardDescription>Revenus des 7 derniers jours.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                      contentStyle={{
                          background: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))"
                      }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenu (€)" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="today">
        <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">Sélectionnez "7 jours" pour voir les données en direct.</p>
        </div>
       </TabsContent>
       <TabsContent value="30days">
        <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">Les données détaillées 30 jours arrivent bientôt.</p>
        </div>
       </TabsContent>
    </Tabs>
  )
}
