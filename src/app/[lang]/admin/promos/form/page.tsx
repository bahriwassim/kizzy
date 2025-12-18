'use client'

import React from 'react'
import { Suspense } from 'react'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { getSupabaseBrowser } from '@/lib/supabase'

const formSchema = z.object({
  code: z.string().min(3, { message: "Le code doit comporter au moins 3 caractères." }).regex(/^[A-Z0-9]+$/, "Le code ne peut contenir que des lettres majuscules et des chiffres."),
  type: z.enum(['Pourcentage', 'Montant Fixe']),
  value: z.coerce.number().positive({ message: "La valeur doit être un nombre positif." }),
  status: z.enum(['Brouillon', 'Actif', 'Programmé', 'Expiré']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

function PromoFormContent() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const promoId = searchParams.get('id');
  const isEditMode = Boolean(promoId);

  // In a real app, you would fetch promo data here if in edit mode
  const defaultValues = isEditMode
    ? { code: 'NYE2026', type: 'Pourcentage' as const, value: 15, status: 'Actif' as const }
    : { code: '', type: 'Pourcentage' as const, value: 0, status: 'Brouillon' as const };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  React.useEffect(() => {
    if (!isEditMode || !promoId) return
    ;(async () => {
      try {
        const { data } = await getSupabaseBrowser()
          .from('promos')
          .select('code,type,value,status,startDate,endDate')
          .eq('id', promoId)
          .single()
        if (data) {
          form.reset({
            code: String(data.code || ''),
            type: (data.type as 'Pourcentage' | 'Montant Fixe') ?? 'Pourcentage',
            value: Number(data.value ?? 0),
            status: (data.status as 'Brouillon' | 'Actif' | 'Programmé' | 'Expiré') ?? 'Brouillon',
            startDate: data.startDate ? new Date(data.startDate as any) : undefined,
            endDate: data.endDate ? new Date(data.endDate as any) : undefined,
          })
        }
      } catch {}
    })()
  }, [isEditMode, promoId])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      code: values.code.trim().toUpperCase(),
      type: values.type,
      value: Number(values.value),
      status: values.status,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
    }
    const res = await fetch('/api/admin/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEditMode && promoId ? { id: promoId, ...payload } : payload),
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Erreur inconnue' }))
      toast({ title: 'Erreur', description: error || 'Impossible d’enregistrer le code promo' })
      return
    }
    toast({
      title: `Code promo ${isEditMode ? 'mis à jour' : 'créé'}`,
      description: `Le code promo "${payload.code}" a été enregistré avec succès.`,
    })
    router.push('/admin/promos')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{isEditMode ? "Modifier le code promo" : 'Créer un nouveau code promo'}</CardTitle>
              <CardDescription>
                Remplissez les détails ci-dessous.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="code" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Code Promo</FormLabel>
                        <FormControl><Input placeholder="EX: SUMMER25" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type de réduction</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Pourcentage">Pourcentage (%)</SelectItem>
                                    <SelectItem value="Montant Fixe">Montant Fixe (€)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="value" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valeur</FormLabel>
                            <FormControl><Input type="number" placeholder={form.watch('type') === 'Pourcentage' ? '15' : '50'} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                 <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Sélectionner un statut" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Brouillon">Brouillon</SelectItem>
                                <SelectItem value="Actif">Actif</SelectItem>
                                <SelectItem value="Programmé">Programmé</SelectItem>
                                <SelectItem value="Expiré">Expiré</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date de début (optionnel)</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Choisir une date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date de fin (optionnel)</FormLabel>
                             <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Choisir une date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/promos">Annuler</Link>
            </Button>
            <Button type="submit">{isEditMode ? 'Enregistrer les modifications' : 'Créer le code promo'}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default function PromoFormPage() {
  return (
    <Suspense fallback={<div />}> 
      <PromoFormContent />
    </Suspense>
  )
}
