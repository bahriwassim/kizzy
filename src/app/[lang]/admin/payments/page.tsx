
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription as CardDescriptionComponent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  publicKey: z.string().startsWith('pk_').min(10, { message: "Clé publique invalide." }),
  secretKey: z.string().startsWith('sk_').min(10, { message: "Clé secrète invalide." }),
  webhookSecret: z.string().startsWith('whsec_').min(10, { message: "Secret de webhook invalide." }),
  isLiveMode: z.boolean(),
})

export default function PaymentsPage() {
  const { toast } = useToast()

  // In a real app, you would fetch these values from a secure location.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookSecret: 'whsec_...',
      isLiveMode: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Paramètres de paiement enregistrés",
      description: "Vos paramètres Stripe ont été mis à jour.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Intégration des Paiements</h1>
        <p className="text-muted-foreground">Gérez votre connexion avec Stripe.</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Configuration de Stripe</CardTitle>
          <CardDescriptionComponent>
            Saisissez vos clés API Stripe. Vous pouvez les trouver sur votre tableau de bord Stripe.
          </CardDescriptionComponent>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="isLiveMode" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel>Mode Live</FormLabel>
                        <FormDescription>
                            Activez ce mode pour traiter des paiements réels.
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name="publicKey" render={({ field }) => (
                <FormItem>
                  <FormLabel>Clé Publique</FormLabel>
                  <FormControl><Input placeholder="pk_live_..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="secretKey" render={({ field }) => (
                <FormItem>
                  <FormLabel>Clé Secrète</FormLabel>
                  <FormControl><Input type="password" placeholder="sk_live_..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="webhookSecret" render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret du Webhook</FormLabel>
                  <FormControl><Input type="password" placeholder="whsec_..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <div className="flex justify-end">
                <Button type="submit">Enregistrer les clés</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
