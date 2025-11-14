'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ProyectoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: any;
  onSuccess: () => void;
}

export function ProyectoDialog({ open, onOpenChange, editingItem, onSuccess }: ProyectoDialogProps) {
  const [tab, setTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    cod_cliente: '',
    cod_ubicacion: '',
    fecha_inicio: '',
    fecha_fin: '',
    monto_total: '',
    estado: 'PENDIENTE',
    tipo: '',
    prioridad: 'MEDIA',
  });

  useEffect(() => {
    if (open) {
      fetchClientes();
      if (editingItem) {
        setFormData({
          nombre: editingItem.nombre || '',
          descripcion: editingItem.descripcion || '',
          codigo: editingItem.codigo || '',
          cod_cliente: editingItem.cod_cliente || '',
          cod_ubicacion: editingItem.cod_ubicacion || '',
          fecha_inicio: editingItem.fecha_inicio || '',
          fecha_fin: editingItem.fecha_fin || '',
          monto_total: editingItem.monto_total || '',
          estado: editingItem.estado || 'PENDIENTE',
          tipo: editingItem.tipo || '',
          prioridad: editingItem.prioridad || 'MEDIA',
        });
      }
    }
  }, [open, editingItem]);

  const fetchClientes = async () => {
    try {
      const res = await fetch('https://personal-proveedor.onrender.com/api/cliente/1');
      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      }
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `https://personal-proveedor.onrender.com/api/proyecto/1/${editingItem.cod_pyto}`
        : 'https://personal-proveedor.onrender.com/api/proyecto/1';

      const payload = {
        ...formData,
        cod_cia: 1,
        monto_total: parseFloat(formData.monto_total),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onOpenChange(false);
      } else {
        alert('Error al guardar el proyecto');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al guardar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="areas">Áreas y Cargos</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" value={formData.codigo} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={formData.cod_cliente} onValueChange={(value) => setFormData({ ...formData, cod_cliente: value })}>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.cod_persona} value={String(c.cod_persona)}>
                        {c.nombre_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="nombre">Nombre del Proyecto</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
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
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto">Presupuesto (S/)</Label>
                <Input
                  id="monto"
                  type="number"
                  value={formData.monto_total}
                  onChange={(e) => setFormData({ ...formData, monto_total: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={formData.prioridad} onValueChange={(value) => setFormData({ ...formData, prioridad: value })}>
                  <SelectTrigger id="prioridad">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAJA">Baja</SelectItem>
                    <SelectItem value="MEDIA">Media</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
          </TabsContent>

          <TabsContent value="areas" className="space-y-4 py-4">
            <div className="text-muted-foreground text-sm">
              Las áreas y cargos serán asignados después de crear el proyecto.
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
