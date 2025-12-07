
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
import Link from 'next/link'
import { SeatMapEditor } from './seat-map-editor'

const formSchema = z.object({
  name: z.string().min(3, { message: "Le nom de la salle doit comporter au moins 3 caractères." }),
  location: z.string().min(3, { message: "Le lieu doit comporter au moins 3 caractères." }),
  capacity: z.coerce.number().int().min(1, { message: "La capacité doit être d'au moins 1." }),
})

function VenueFormContent() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const venueId = searchParams.get('id');
  const isEditMode = Boolean(venueId);

  // In a real app, you would fetch venue data here if in edit mode
  const defaultValues = isEditMode
    ? { name: 'Grand Arena', location: 'New York, NY', capacity: 12000 }
    : { name: '', location: '', capacity: 0 };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: `Salle ${isEditMode ? 'mise à jour' : 'créée'}`,
      description: `La salle "${values.name}" a été enregistrée avec succès.`,
    })
    // Don't redirect immediately to see the toast
    // router.push('/admin/seats')
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="font-headline text-3xl font-bold">{isEditMode ? "Modifier la salle" : 'Créer une nouvelle salle'}</h1>
                    <p className="text-muted-foreground">Remplissez les détails et configurez le plan de salle ci-dessous.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/seats">Annuler</Link>
                    </Button>
                    <Button type="submit">{isEditMode ? 'Enregistrer les modifications' : 'Créer la salle'}</Button>
                </div>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Détails de la Salle</CardTitle>
                  <CardDescription>Informations générales sur la salle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la salle</FormLabel>
                      <FormControl><Input placeholder="Grand Arena" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu</FormLabel>
                      <FormControl><Input placeholder="New York, NY" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="capacity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacité</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <SeatMapEditor />
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default function VenueFormPage() {
  return (
    <Suspense fallback={<div />}> 
      <VenueFormContent />
    </Suspense>
  )
}
