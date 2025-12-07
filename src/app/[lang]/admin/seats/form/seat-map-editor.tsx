
'use client'

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  Active,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableIcon } from '@/components/ui/table-icon';


type SeatTier = 'Ultra VIP' | 'VIP' | 'Premium';

interface Seat {
  id: string;
  label: string;
}

interface Section {
  id: string;
  name: string;
  tier: SeatTier;
  rows: number;
  seatsPerRow: number;
}

const initialSections: Section[] = [
    { id: 'section-1', name: 'Section Ultra VIP', tier: 'Ultra VIP', rows: 2, seatsPerRow: 10 },
    { id: 'section-2', name: 'Section VIP', tier: 'VIP', rows: 4, seatsPerRow: 12 },
    { id: 'section-3', name: 'Section Premium', tier: 'Premium', rows: 5, seatsPerRow: 14 },
];

function SeatItem({ seat, tier }: { seat: Seat, tier: SeatTier }) {
    const tierColors = {
        'Ultra VIP': 'border-yellow-400 text-yellow-400',
        'VIP': 'border-purple-400 text-purple-400',
        'Premium': 'border-blue-400 text-blue-400',
    };
    return (
        <div className={cn('w-8 h-8 rounded-md border-2 flex items-center justify-center text-xs font-mono', tierColors[tier])}>
            {seat.label}
        </div>
    )
}

function SortableSectionItem({ section, onUpdate, onDelete }: { section: Section, onUpdate: (id: string, data: Partial<Section>) => void, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-manipulation">
      <Card className="bg-background/50">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
          <div {...attributes} {...listeners} className="cursor-grab p-2">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-grow">
            <Input 
                value={section.name} 
                onChange={(e) => onUpdate(section.id, { name: e.target.value })}
                className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 p-0"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete(section.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label>Niveau</Label>
                <Select value={section.tier} onValueChange={(value: SeatTier) => onUpdate(section.id, { tier: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Ultra VIP">Ultra VIP</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label>Rangées</Label>
                <Input 
                    type="number" 
                    value={section.rows} 
                    onChange={(e) => onUpdate(section.id, { rows: parseInt(e.target.value, 10) || 0 })}
                />
            </div>
             <div className="space-y-2">
                <Label>Sièges par rangée</Label>
                <Input 
                    type="number" 
                    value={section.seatsPerRow} 
                    onChange={(e) => onUpdate(section.id, { seatsPerRow: parseInt(e.target.value, 10) || 0 })}
                />
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <div className="space-y-2 w-full">
                <Label className="text-xs text-muted-foreground">Aperçu des tables</Label>
                 <div className="p-4 rounded-lg bg-primary/10 flex flex-wrap gap-2">
                    {Array.from({ length: Math.min(section.rows * section.seatsPerRow, 30) }).map((_, i) => (
                        <TableIcon key={i} className="w-5 h-5 text-muted-foreground" />
                    ))}
                 </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}


export function SeatMapEditor() {
    const [sections, setSections] = useState<Section[]>(initialSections);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    
    const activeSection = activeId ? sections.find(s => s.id === activeId) : null;

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
        setSections((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
        }
    }

    const handleAddSection = () => {
        const newId = `section-${Date.now()}`;
        const newSection: Section = {
            id: newId,
            name: `Nouvelle Section`,
            tier: 'Premium',
            rows: 4,
            seatsPerRow: 10,
        };
        setSections(prev => [...prev, newSection]);
    };

    const handleUpdateSection = (id: string, data: Partial<Section>) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const handleDeleteSection = (id: string) => {
        setSections(prev => prev.filter(s => s.id !== id));
    };

    return (
        <Card>
        <CardHeader>
            <CardTitle>Éditeur de Plan de Salle</CardTitle>
            <CardDescription>
                Ajoutez, supprimez et réorganisez les sections de tables. Utilisez la poignée <GripVertical className="inline h-4 w-4" /> pour faire glisser et déposer.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            >
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                {sections.map(section => (
                    <SortableSectionItem 
                        key={section.id} 
                        section={section} 
                        onUpdate={handleUpdateSection}
                        onDelete={handleDeleteSection}
                    />
                ))}
                </div>
            </SortableContext>
            <DragOverlay>
                {activeSection ? (
                    <SortableSectionItem section={activeSection} onUpdate={() => {}} onDelete={() => {}} />
                ) : null}
            </DragOverlay>
            </DndContext>
        </CardContent>
        <CardFooter>
            <Button variant="outline" onClick={handleAddSection}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une section
            </Button>
        </CardFooter>
        </Card>
    );
}
