
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Euro, Users, Ticket, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

const salesData = [
  { name: 'Lun', revenue: 2400 },
  { name: 'Mar', revenue: 1398 },
  { name: 'Mer', revenue: 9800 },
  { name: 'Jeu', revenue: 3908 },
  { name: 'Ven', revenue: 4800 },
  { name: 'Sam', revenue: 3800 },
  { name: 'Dim', revenue: 4300 },
];

export default function DashboardPage() {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Fonctionnalité non disponible",
      description: "La fonction d'exportation n'est pas encore implémentée.",
    })
  }

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
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 231,89 €</div>
            <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billets Vendus</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Section Populaire</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Premium</div>
            <p className="text-xs text-muted-foreground">45% des ventes totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promos Utilisées</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Ventes avec réduction : 8 420 €</p>
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
              <BarChart data={salesData}>
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
                  <Bar dataKey="revenue" name="Revenu" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="today">
        <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">Les données pour "Aujourd'hui" seront affichées ici.</p>
        </div>
       </TabsContent>
       <TabsContent value="30days">
        <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">Les données pour "30 jours" seront affichées ici.</p>
        </div>
       </TabsContent>
    </Tabs>
  )
}
