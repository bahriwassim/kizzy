'use client'

import { Suspense } from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

const formSchema = z.object({
  name: z.string().min(3, { message: "Le nom de l'événement doit comporter au moins 3 caractères." }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "La date est requise."}),
  location: z.string().min(1, { message: "Le lieu est requis."}),
  status: z.enum(['Brouillon', 'Actif', 'Terminé']),
})

function EventFormContent() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('id');
  const isEditMode = Boolean(eventId);

  // In a real app, you would fetch event data here if in edit mode
  const defaultValues = isEditMode
    ? { name: `Golden Paris NYE 2026`, description: 'La plus grande soirée du Nouvel An !', date: '2025-12-31T20:00', location: 'Grand Arena, New York', status: 'Actif' as const }
    : { name: '', description: '', date: '', location: '', status: 'Brouillon' as const };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: `Événement ${isEditMode ? 'mis à jour' : 'créé'}`,
      description: `L'événement "${values.name}" a été enregistré avec succès.`,
    })
    router.push('/admin/events')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="font-headline text-3xl font-bold">{isEditMode ? "Modifier l'événement" : 'Créer un nouvel événement'}</h1>
                        <p className="text-muted-foreground">
                            Remplissez les détails ci-dessous.
                        </p>
                    </div>
                    <div className="flex w-full sm:w-auto justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/events">Annuler</Link>
                        </Button>
                        <Button type="submit">{isEditMode ? 'Enregistrer' : 'Créer'}</Button>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Détails de l'événement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom de l'événement</FormLabel>
                                <FormControl><Input placeholder="Golden Paris NYE 2026" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Décrivez votre événement..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date et heure</FormLabel>
                                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lieu</FormLabel>
                                    <FormControl><Input placeholder="Grand Arena" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Statut</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Brouillon">Brouillon</SelectItem>
                                        <SelectItem value="Actif">Actif</SelectItem>
                                        <SelectItem value="Terminé">Terminé</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
            </form>
        </Form>
    </div>
  )
}

export default function EventFormPage() {
  return (
    <Suspense fallback={<div />}> 
      <EventFormContent />
    </Suspense>
  )
}
