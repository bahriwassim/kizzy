'use client'

import React from 'react'
import { Card, CardContent, CardDescription as CardDescriptionComponent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Locale } from '@/i18n-config'
import { Input } from '@/components/ui/input'

type WorkbenchResult = {
  stripe_ok: boolean
  source?: 'env' | 'db' | 'none'
  webhook_secret_present?: boolean
  balance_available?: number
  balance_pending?: number
  error?: string
}

export default function StripeWorkbenchPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { toast } = useToast()
  const [langState, setLangState] = React.useState<Locale>('fr')
  React.useEffect(() => { params.then(p => setLangState(p.lang)) }, [params])
  const [result, setResult] = React.useState<WorkbenchResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [testEmail, setTestEmail] = React.useState('')
  const [sending, setSending] = React.useState(false)

  async function run() {
    setLoading(true)
    try {
      const res = await fetch('/api/payments/workbench', { cache: 'no-store' })
      const json: WorkbenchResult = await res.json()
      setResult(json)
      if (json.stripe_ok) {
        toast({ title: langState === 'en' ? 'Stripe OK' : 'Stripe OK', description: langState === 'en' ? 'Connection succeeded' : 'Connexion réussie' })
      } else {
        toast({ variant: 'destructive', title: 'Stripe KO', description: json.error || 'Erreur inconnue' })
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erreur', description: e.message || 'Impossible d’exécuter le test' })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { run() }, [])

  const formatCents = (n?: number) => `${((n || 0) / 100).toFixed(2)} EUR`
  const sendTest = async () => {
    setSending(true)
    try {
      const res = await fetch('/api/payments/workbench/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail }),
      })
      const j = await res.json().catch(() => ({} as any))
      if (res.ok) {
        toast({ title: 'E-mail envoyé', description: `Vérifiez ${testEmail}` })
      } else {
        toast({ variant: 'destructive', title: 'Échec de l’envoi', description: j?.error || 'Erreur inconnue' })
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erreur', description: e.message || 'Impossible d’envoyer' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Stripe Workbench</h1>
        <p className="text-muted-foreground">Diagnostiquer rapidement la configuration Stripe.</p>
      </div>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Diagnostic</CardTitle>
          <CardDescriptionComponent>
            Teste la clé Stripe, l’origine (env ou base), la présence du secret webhook, et récupère le solde.
          </CardDescriptionComponent>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={run} disabled={loading}>{loading ? 'Analyse…' : 'Relancer le test'}</Button>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="email de test" value={testEmail} onChange={e => setTestEmail(e.target.value)} />
            <Button onClick={sendTest} disabled={sending || !testEmail}>Envoyer e-mail de test</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paramètre</TableHead>
                <TableHead>Valeur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Connexion Stripe</TableCell>
                <TableCell>{result?.stripe_ok ? 'OK' : 'KO'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Source de la clé secrète</TableCell>
                <TableCell>{result?.source || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Webhook secret présent</TableCell>
                <TableCell>{result?.webhook_secret_present ? 'Oui' : 'Non'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Solde disponible</TableCell>
                <TableCell>{formatCents(result?.balance_available)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Solde en attente</TableCell>
                <TableCell>{formatCents(result?.balance_pending)}</TableCell>
              </TableRow>
              {result?.error && (
                <TableRow>
                  <TableCell>Erreur</TableCell>
                  <TableCell className="text-destructive">{result.error}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
