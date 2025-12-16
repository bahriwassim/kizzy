
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Euro, Users, Ticket, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import React from "react"
import { getSupabaseBrowser } from "@/lib/supabase"

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
        const supabase = getSupabaseBrowser()
        const since7d = new Date()
        since7d.setDate(since7d.getDate() - 6)
        since7d.setHours(0, 0, 0, 0)
        const since14d = new Date()
        since14d.setDate(since14d.getDate() - 13)
        since14d.setHours(0, 0, 0, 0)

        const { data: orders7d } = await supabase
          .from('orders')
          .select('amount_total,created_at')
          .gte('created_at', since7d.toISOString())

        const { data: ordersPrev7d } = await supabase
          .from('orders')
          .select('amount_total,created_at')
          .gte('created_at', since14d.toISOString())
          .lte('created_at', new Date(since7d.getTime() - 1).toISOString())

        const { data: tickets, count: ticketsCount } = await supabase
          .from('tickets')
          .select('id', { count: 'exact' })
        setTicketsSold(ticketsCount || (tickets?.length || 0))

        const { data: inventoryRows } = await supabase
          .from('inventory')
          .select('tier, capacity, sold_count')

        const totalSold = (inventoryRows || []).reduce((a, r) => a + (r.sold_count || 0), 0)
        const top = (inventoryRows || []).reduce<InventoryRow | null>((best, row) => {
          if (!best) return row
          return (row.sold_count || 0) > (best.sold_count || 0) ? row : best
        }, null)
        if (top) {
          setPopularSection(String(top.tier))
          const share = totalSold > 0 ? Math.round(((top.sold_count || 0) / totalSold) * 100) : 0
          setPopularShare(share)
        } else {
          setPopularSection('-')
          setPopularShare(0)
        }

        const { data: promosRows } = await supabase
          .from('promos')
          .select('redemptions')
        const promoCount = (promosRows || []).reduce((a, r) => a + (r.redemptions || 0), 0)
        setPromosUsed(promoCount)

        const dailyMap = new Map<string, number>()
        for (let i = 0; i < 7; i++) {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          d.setHours(0, 0, 0, 0)
          dailyMap.set(d.toDateString(), 0)
        }
        let total = 0
        for (const o of orders7d || []) {
          const d = new Date(o.created_at as any)
          d.setHours(0, 0, 0, 0)
          const key = d.toDateString()
          const prev = dailyMap.get(key) || 0
          const amt = Math.round((o.amount_total || 0))
          dailyMap.set(key, prev + amt)
          total += amt
        }
        setTotalRevenue(Math.round(total) / 100)
        const prevTotal = (ordersPrev7d || []).reduce((a, o) => a + Math.round(o.amount_total || 0), 0)
        const growth = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 100
        setRevenueGrowth(Math.round(growth))

        const weekly: DailyRevenue[] = Array.from(dailyMap.entries()).map(([k, v]) => {
          const date = new Date(k)
          return { name: formatDayLabel(date), revenue: Math.round(v / 100) }
        })
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
