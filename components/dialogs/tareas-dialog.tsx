'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { API_ENDPOINTS } from '@/lib/config';
import { Combobox } from '@/components/ui/combobox';
import { Check } from 'lucide-react'
import { ContratoDialog } from './contrato-dialog';

interface TareaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingItem?: any;
    onSuccess: () => void;
}

export function TareaDialog({ open, onOpenChange, editingItem, onSuccess }: TareaDialogProps) {
    const [tab, setTab] = useState('personal');
    const [contratoDialog, setContratoDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setEditing] = useState(false)
    const [personal, setPersonal] = useState<any[]>([]);
    const [proveedor, setProveedor] = useState<any[]>([])
    const [tarea, setTarea] = useState<any[]>([])
    const [actividad, setActividad] = useState<any[]>([])
    const [formData, setFormData] = useState({
        codCia: 1,
        codTarea: 12, // TODO: endpoint de códigos
        codEmpleado: '',
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        estado: 'PENDIENTE',
    });
    const [formAct, setFormAct] = useState({
        codCIA: 1,
        codActividad: '1535', // TODO: endpoint de códigos
        codProveedor: '',
        codContrato: '13435',
        descripcion: '',
        fechaActividad: '',
        monto: '',
        estado: 'PENDIENTE',
        documento: '',
        observaciones: ''
    })
    const [contratoSuccess, setContratoSuccess] = useState(false)

    // Resetear estado de éxito si cambia el proveedor seleccionado
    useEffect(() => {
        setContratoSuccess(false);
    }, [formAct.codProveedor]);

    useEffect(() => {
        if (open) {
            fetchPersonal();
            fetchProveedor();
            fetchTarea();
            fetchActividad();
        } else {
            setEditing(false)
        }
    }, [open]);


    const fetchPersonal = async () => {
        try {
            const res = await fetch(`${API_ENDPOINTS.EMPLEADO}/completos`);
            if (res.ok) {
                const data = await res.json();
                setPersonal(data);
            }
        } catch (error) {
            console.error('Error fetching clientes:', error);
        }
    };

    const fetchProveedor = async () => {
        try {
            const res = await fetch(`${API_ENDPOINTS.PROVEEDOR}/completos`);
            if (res.ok) {
                const data = await res.json();
                setProveedor(data);
            }
        } catch (error) {
            console.error('Error fetching clientes:', error);
        }
    };

    const fetchTarea = async () => {
        try {
            const res = await fetch(`${API_ENDPOINTS.TAREA_PERSONAL}`);
            if (res.ok) {
                const data = await res.json();
                setTarea(data);
            }
        } catch (error) {
            console.error('Error fetching clientes:', error);
        }
    };

    const fetchActividad = async () => {
        try {
            const res = await fetch(`${API_ENDPOINTS.ACTIVIDAD_PROVEEDOR}`);
            if (res.ok) {
                const data = await res.json();
                setActividad(data);
            }
        } catch (error) {
            console.error('Error fetching clientes:', error);
        }
    };

    const handleContrato = () => {
        setContratoDialog(true)
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const url = tab === 'personal' ? `${API_ENDPOINTS.TAREA_PERSONAL}` : `${API_ENDPOINTS.ACTIVIDAD_PROVEEDOR}`;
            const form = tab === 'personal' ? formData : formAct;
            const payload = {
                ...form,
                codPyto: editingItem.codPyto
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onSuccess();
                onOpenChange(false);
            } else {
                alert('Error al guardar la tarea');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error al guardar la tarea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Asignar tarea</DialogTitle>
                </DialogHeader>

                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="proveedor">Proveedor</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4 py-4">
                        {!isEditing ? (<Accordion
                            type='single'
                            collapsible>
                            {tarea.map((t, idx) => (
                                <AccordionItem value={'item' + idx} key={`exp-${idx}`} className="place-items-baseline hover:bg-foreground/15">
                                    <AccordionTrigger className="hover:cursor-pointer flex justify-between"><p>{t.nombre || '-'}</p>
                                        <p className='justify-self-end'><span className={`px-2 py-1 rounded-full text-xs font-medium 
                                    ${t.estado === 'COMPLETADA'
                                                ? 'bg-green-100 text-green-800'
                                                : t.estado === 'PENDIENTE'
                                                    ? 'bg-red-100 text-orange-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {t.estado === "COMPLETADA"
                                                ? "Completado"
                                                : t.estado === 'PENDIENTE'
                                                    ? 'Pendiente'
                                                    : 'En proceso'}
                                        </span></p> </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs text-muted-foreground">Del {t.fechaInicio || '-'} - {t.fechaFin || '-'}</p>
                                        <p>{t.descripcion}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>) : (<div>
                            <div className="border-t py-4 space-y-2">
                                <h3 className="font-semibold mb-4">Personal</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="personal flex-1 relative">
                                        <Combobox
                                            items={personal.map(p => ({ value: p.codEmpleado, label: p.persona?.desPersona }))}
                                            value={formData.codEmpleado}
                                            onChange={(v: string) => setFormData({ ...formData, codEmpleado: v })}
                                            placeholder="Seleccionar personal..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4 grid grid-cols-2 gap-4">
                                <h3 className="font-semibold col-span-2">Tarea</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                                        <SelectTrigger id="estado">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                            <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
                                            <SelectItem value="COMPLETADO">Completado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                                    <Input
                                        id="fecha_inicio"
                                        type="date"
                                        value={formData.fechaInicio}
                                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_fin">Fecha de Término</Label>
                                    <Input
                                        id="fecha_fin"
                                        type="date"
                                        value={formData.fechaFin}
                                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                    />
                                </div>

                            </div></div>)}
                    </TabsContent>

                    <TabsContent value="proveedor" className="space-y-4 py-4">
                        {!isEditing ? (<Accordion
                            type='single'
                            collapsible>
                            {actividad.map((act, idx) => (
                                <AccordionItem value={'item' + idx} key={`exp-${idx}`} className="place-items-baseline hover:bg-foreground/15">
                                    <AccordionTrigger className="hover:cursor-pointer flex justify-between"><p>{act.descripcion || '-'}</p>
                                        <p className='justify-self-end'><span className={`px-2 py-1 rounded-full text-xs font-medium 
                                    ${act.estado === 'COMPLETADA'
                                                ? 'bg-green-100 text-green-800'
                                                : act.estado === 'PENDIENTE'
                                                    ? 'bg-red-100 text-orange-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {act.estado === "COMPLETADA"
                                                ? "Completado"
                                                : act.estado === 'PENDIENTE'
                                                    ? 'Pendiente'
                                                    : 'En proceso'}
                                        </span></p> </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs text-muted-foreground">El {act.fechaActividad || '-'}</p>
                                        <p>Monto total: {act.monto}</p>
                                        <p>{act.observaciones}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>) : (<div>
                            <div className='flex items-center justify-between'>
                                <Button variant="default" onClick={handleContrato} disabled={!formAct?.codProveedor || contratoSuccess}>
                                    Generar contrato...

                                </Button>
                                <p className="mt-2 text-xs leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
                                    <Check size={16} className='text-lime-500' /> Contrato registrado exitosamente.
                                </p>

                            </div>

                            <div className="border-t py-4 mt-4 space-y-2">
                                <h3 className="font-semibold mb-4">Proveedor</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="personal flex-1 relative">
                                        <Combobox
                                            items={proveedor.map(p => ({ value: p.codProveedor, label: p.persona?.desPersona }))}
                                            value={formAct.codProveedor}
                                            onChange={(v: string) => setFormAct({ ...formAct, codProveedor: v })}
                                            placeholder="Seleccionar proveedor..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t py-4 grid grid-cols-2 gap-4">
                                <h3 className="font-semibold col-span-2">Actividad</h3>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Input
                                        id="descripcion"
                                        value={formAct.descripcion}
                                        onChange={(e) => setFormAct({ ...formAct, descripcion: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="monto">Costo Total (S/)</Label>
                                    <Input
                                        id="monto"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={formAct.monto}
                                        onChange={(e) => setFormAct({ ...formAct, monto: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fechaActividad">Fecha</Label>
                                    <Input
                                        id="fechaActividad"
                                        type="date"
                                        value={formAct.fechaActividad}
                                        onChange={(e) => setFormAct({ ...formAct, fechaActividad: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="descripcion">Observaciones</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={formAct.observaciones}
                                        onChange={(e) => setFormAct({ ...formAct, observaciones: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado</Label>
                                    <Select value={formAct.estado} onValueChange={(value) => setFormAct({ ...formAct, estado: value })}>
                                        <SelectTrigger id="estado">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                            <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
                                            <SelectItem value="COMPLETADO">Completado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>
                        </div>)}
                    </TabsContent>
                </Tabs>

                <div className="flex gap-3 justify-end mt-6">
                    {!isEditing ? (<Button variant="outline" onClick={() => setEditing(true)}>
                        + Agregar tarea
                    </Button>) : (<Button variant="outline" onClick={() => setEditing(false)}>
                        Cancelar
                    </Button>)}
                    {!isEditing ? "" : (<Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>)}

                </div>
            </DialogContent>

            <ContratoDialog
                open={contratoDialog}
                onOpenChange={setContratoDialog}
                codProveedor={formAct.codProveedor}
                codPyto={editingItem?.codPyto}
                onSuccess={() => {
                    setContratoSuccess(true);
                    setContratoDialog(false);
                }}
            />
        </Dialog>
    );
}
