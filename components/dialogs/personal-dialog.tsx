'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: any;
  onSuccess: () => void;
}

export function PersonalDialog({ open, onOpenChange, editingItem, onSuccess }: PersonalDialogProps) {
  const [tab, setTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<any[]>([]);
  const [cargos, setCargos] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    // Datos personales
    nombre_completo: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    documento_identidad: '',
    cod_area: '',
    cod_cargo: '',
    estado: '1',
  });

  const [formacionData, setFormacionData] = useState({
    tipo_grado: '',
    carrera: '',
    titulo: '',
    institucion: '',
    fecha_obtencion: '',
    especialidad: '',
    horas_capacitacion: '',
    empresa: '',
    especialidad_laboral: '',
    fecha_inicio_laboral: '',
    fecha_fin_laboral: '',
  });

  useEffect(() => {
    if (open) {
      fetchAreas();
      fetchCargos();
      if (editingItem) {
        setFormData({
          nombre_completo: editingItem.nombre_completo || '',
          apellido_paterno: editingItem.apellido_paterno || '',
          apellido_materno: editingItem.apellido_materno || '',
          email: editingItem.email || '',
          telefono: editingItem.telefono || '',
          direccion: editingItem.direccion || '',
          fecha_nacimiento: editingItem.fecha_nacimiento || '',
          documento_identidad: editingItem.documento_identidad || '',
          cod_area: editingItem.cod_area || '',
          cod_cargo: editingItem.cod_cargo || '',
          estado: editingItem.estado || '1',
        });
      }
    }
  }, [open, editingItem]);

  const fetchAreas = async () => {
    try {
      const res = await fetch('https://personal-proveedor.onrender.com/api/area/1');
      if (res.ok) {
        const data = await res.json();
        setAreas(data);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const fetchCargos = async () => {
    try {
      const res = await fetch('https://personal-proveedor.onrender.com/api/cargo-area/1');
      if (res.ok) {
        const data = await res.json();
        setCargos(data);
      }
    } catch (error) {
      console.error('Error fetching cargos:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `https://personal-proveedor.onrender.com/api/empleado/1/${editingItem.cod_empleado}`
        : 'https://personal-proveedor.onrender.com/api/empleado/1';

      const payload = {
        ...formData,
        cod_cia: 1,
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
        alert('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Editar Personal' : 'Agregar Personal'}</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Datos Personales</TabsTrigger>
            <TabsTrigger value="formacion">Formación</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento">Documento</Label>
                <Input
                  id="documento"
                  value={formData.documento_identidad}
                  onChange={(e) => setFormData({ ...formData, documento_identidad: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de Nacimiento</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área</Label>
                <Select value={formData.cod_area} onValueChange={(value) => setFormData({ ...formData, cod_area: value })}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Seleccionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.cod_area} value={String(area.cod_area)}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select value={formData.cod_cargo} onValueChange={(value) => setFormData({ ...formData, cod_cargo: value })}>
                  <SelectTrigger id="cargo">
                    <SelectValue placeholder="Seleccionar cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((cargo) => (
                      <SelectItem key={cargo.cod_cargo} value={String(cargo.cod_cargo)}>
                        {cargo.nombre_cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formacion" className="space-y-4 py-4">
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Grado Académico</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_grado">Tipo de Grado</Label>
                  <Select value={formacionData.tipo_grado} onValueChange={(value) => setFormacionData({ ...formacionData, tipo_grado: value })}>
                    <SelectTrigger id="tipo_grado">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LICENCIATURA">Licenciatura</SelectItem>
                      <SelectItem value="MAESTRIA">Maestría</SelectItem>
                      <SelectItem value="DOCTORADO">Doctorado</SelectItem>
                      <SelectItem value="TECNICO">Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carrera">Carrera</Label>
                  <Input
                    id="carrera"
                    value={formacionData.carrera}
                    onChange={(e) => setFormacionData({ ...formacionData, carrera: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formacionData.titulo}
                    onChange={(e) => setFormacionData({ ...formacionData, titulo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institucion">Institución</Label>
                  <Input
                    id="institucion"
                    value={formacionData.institucion}
                    onChange={(e) => setFormacionData({ ...formacionData, institucion: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="fecha_obtencion">Fecha de Obtención</Label>
                  <Input
                    id="fecha_obtencion"
                    type="date"
                    value={formacionData.fecha_obtencion}
                    onChange={(e) => setFormacionData({ ...formacionData, fecha_obtencion: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Especialización</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="especialidad">Especialidad</Label>
                  <Input
                    id="especialidad"
                    value={formacionData.especialidad}
                    onChange={(e) => setFormacionData({ ...formacionData, especialidad: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horas">Horas de Capacitación</Label>
                  <Input
                    id="horas"
                    type="number"
                    value={formacionData.horas_capacitacion}
                    onChange={(e) => setFormacionData({ ...formacionData, horas_capacitacion: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Experiencia Laboral</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={formacionData.empresa}
                    onChange={(e) => setFormacionData({ ...formacionData, empresa: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="especialidad_laboral">Especialidad</Label>
                  <Input
                    id="especialidad_laboral"
                    value={formacionData.especialidad_laboral}
                    onChange={(e) => setFormacionData({ ...formacionData, especialidad_laboral: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={formacionData.fecha_inicio_laboral}
                    onChange={(e) => setFormacionData({ ...formacionData, fecha_inicio_laboral: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_fin">Fecha Fin</Label>
                  <Input
                    id="fecha_fin"
                    type="date"
                    value={formacionData.fecha_fin_laboral}
                    onChange={(e) => setFormacionData({ ...formacionData, fecha_fin_laboral: e.target.value })}
                  />
                </div>
              </div>
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
