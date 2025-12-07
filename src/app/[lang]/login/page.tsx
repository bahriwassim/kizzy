'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRouter, useParams } from 'next/navigation'
import { PartyPopper } from 'lucide-react'
import { Locale } from '@/i18n-config'

const formSchema = z.object({
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères." }),
})

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams<{ lang: Locale }>()
  const lang = params.lang

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would authenticate the user here.
    console.log(values)
    if (values.email === 'admin@example.com' && values.password === 'password') {
        toast({
            title: "Connexion réussie",
            description: "Bienvenue sur votre tableau de bord.",
        })
        router.push(`/${lang}/admin/dashboard`)
    } else {
        toast({
            variant: "destructive",
            title: "Échec de la connexion",
            description: "Adresse e-mail ou mot de passe incorrect.",
        })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <PartyPopper className="h-8 w-8 text-accent" />
            </div>
          <CardTitle className="font-headline text-3xl">Panneau d'Administration</CardTitle>
          <CardDescription>Connectez-vous pour gérer vos événements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse E-mail</FormLabel>
                  <FormControl><Input type="email" placeholder="admin@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <Button type="submit" className="w-full">Se connecter</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
