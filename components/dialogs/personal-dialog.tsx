'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/config';

interface PersonalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: any;
  onSuccess: () => void;
}

export function PersonalDialog({ open, onOpenChange, editingItem, onSuccess }: PersonalDialogProps) {
  const [tab, setTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  console.log(editingItem)

  const [formData, setFormData] = useState({
    // Datos personales
    nombre_completo: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    documento_identidad: '',
  });



  // Ahora permitimos múltiples entradas
  const [grados, setGrados] = useState<any[]>([]);
  const [especializaciones, setEspecializaciones] = useState<any[]>([]);
  const [experiencias, setExperiencias] = useState<any[]>([]);

  // Estados temporales para agregar nuevos ítems
  const [newGrado, setNewGrado] = useState({ codCia: '', codGrado: '', codEmpleado: '', tipoGrado: '', carrera: '', titulo: '', institucion: '', fechaObtencion: '', documento: '' });
  const [newEspecializacion, setNewEspecializacion] = useState({ codCia: '', codEspecialidad: '', codEmpleado: '', especialidad: '', certificado: '', institucion: '', fechaObtencion: '', horasCapacitacion: '' });
  const [newExperiencia, setNewExperiencia] = useState({ empresa: '', especialidad_laboral: '', fecha_inicio_laboral: '', fecha_fin_laboral: '' });

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setIsEditing(false); // Iniciar en modo visualización cuando hay un item
        setFormData({
          nombre_completo: editingItem.persona?.desPersona || '',
          email: editingItem.email || '',
          telefono: editingItem.celular || '',
          direccion: editingItem.direcc || '',
          fecha_nacimiento: editingItem.fecNac || '',
          documento_identidad: editingItem.dni || '',
        });

        // Inicializar listas a partir del item si vienen como arrays
        if (Array.isArray(editingItem.gradosAcademicos)) {
          setGrados(editingItem.gradosAcademicos);
        } else {
          setGrados([]);
        }

        if (Array.isArray(editingItem.especialidades)) {
          setEspecializaciones(editingItem.especialidades);
        } else if (editingItem.especialidad) {
          setEspecializaciones([{
            codCia: '',
            codEspecialidad: '',
            codEmpleado: '',
            especialidad: editingItem.especialidad || '',
            horas_capacitacion: editingItem.horas_capacitacion || '',
          }]);
        } else {
          setEspecializaciones([]);
        }

        if (Array.isArray(editingItem.experiencias_laborales)) {
          setExperiencias(editingItem.experiencias_laborales);
        } else if (editingItem.empresa) {
          setExperiencias([{
            empresa: editingItem.empresa || '',
            especialidad_laboral: editingItem.especialidad_laboral || '',
            fecha_inicio_laboral: editingItem.fecha_inicio_laboral || '',
            fecha_fin_laboral: editingItem.fecha_fin_laboral || '',
          }]);
        } else {
          setExperiencias([]);
        }

      } else {
        setIsEditing(true); // Modo edición cuando es nuevo item
        setFormData({
          nombre_completo: '',
          email: '',
          telefono: '',
          direccion: '',
          fecha_nacimiento: '',
          documento_identidad: '',
        });
        setGrados([]);
        setEspecializaciones([]);
        setExperiencias([]);
        setNewGrado({ codCia: '', codGrado: '', codEmpleado: '', tipoGrado: '', carrera: '', titulo: '', institucion: '', fechaObtencion: '', documento: '' });
        setNewEspecializacion({ codCia: '', codEspecialidad: '', codEmpleado: '', especialidad: '', certificado: '', institucion: '', fechaObtencion: '', horasCapacitacion: '' });
        setNewExperiencia({ empresa: '', especialidad_laboral: '', fecha_inicio_laboral: '', fecha_fin_laboral: '' });
      }
    } else {
      // Resetear estado cuando se cierra el diálogo
      setIsEditing(false);
      setTab('personal');
    }
  }, [open, editingItem]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `${API_ENDPOINTS.EMPLEADO}/1/${editingItem.cod_empleado}`
        : `${API_ENDPOINTS.EMPLEADO}`;

      const payload = {
        ...formData,
        cod_cia: 1,
        grados_academicos: grados,
        especializaciones: especializaciones,
        experiencias_laborales: experiencias,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      grados.forEach(grad => {
        fetch(`${API_ENDPOINTS.GRADO}/${method !== 'POST' ? grad.codCia + '/' + grad.codGrado + '/' + grad.codEmpleado : ''}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(grad)
        })
          .catch(error => {
            console.error('Error al hacer la solicitud:', error);
          });
      })

      especializaciones.forEach(esp => {
        fetch(`${API_ENDPOINTS.EMPLEADO}/${method !== 'POST' ? esp.codCia + '/' + esp.codEspecialidad + '/' + esp.codEmpleado : ''}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(esp)
        })
          .catch(error => {
            console.error('Error al hacer la solicitud:', error);
          });
      })

      experiencias.forEach(exp => {
        fetch(`${API_ENDPOINTS.EMPLEADO}/${method !== 'POST' ? exp.codCia + '/' + exp.codExperiencia + '/' + exp.codEmpleado : ''}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exp)
        })
          .catch(error => {
            console.error('Error al hacer la solicitud:', error);
          });
      })
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
          <div className="flex justify-between items-center">
            <DialogTitle>
              {editingItem ? (isEditing ? 'Editar Personal' : 'Ver Personal') : 'Agregar Personal'}
            </DialogTitle>

          </div>
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
                {editingItem && !isEditing ? (
                  <div className="px-3 py-2 rounded-md text-sm">
                    {formData.nombre_completo || '-'}
                  </div>
                ) : (
                  <Input
                    id="nombre"
                    value={formData.nombre_completo}
                    onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                    readOnly={!isEditing && !!editingItem}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {editingItem && !isEditing ? (
                  <div className="px-3 py-2 rounded-md text-sm">
                    {formData.email || '-'}
                  </div>
                ) : (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    readOnly={!isEditing && !!editingItem}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                {editingItem && !isEditing ? (
                  <div className="px-3 py-2 rounded-md text-sm">
                    {formData.telefono || '-'}
                  </div>
                ) : (
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    readOnly={!isEditing && !!editingItem}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento">Documento</Label>
                {editingItem && !isEditing ? (
                  <div className="px-3 py-2 rounded-md text-sm">
                    {formData.documento_identidad || '-'}
                  </div>
                ) : (
                  <Input
                    id="documento"
                    value={formData.documento_identidad}
                    onChange={(e) => setFormData({ ...formData, documento_identidad: e.target.value })}
                    readOnly={!isEditing && !!editingItem}
                  />
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                {editingItem && !isEditing ? (
                  <div className="px-3 py-2 rounded-md text-sm">
                    {formData.direccion || '-'}
                  </div>
                ) : (
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    readOnly={!isEditing && !!editingItem}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de Nacimiento</Label>
                {editingItem && !isEditing ? (
                  <div className="px-3 py-2 rounded-md text-sm">
                    {formData.fecha_nacimiento || '-'}
                  </div>
                ) : (
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    readOnly={!isEditing && !!editingItem}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formacion" className="space-y-4 py-4">
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Grados Académicos</h3>

              {grados.length === 0 && <div className="text-sm text-muted-foreground mb-2">No hay grados registrados.</div>}

              <div className="space-y-2 mb-4">
                {grados.map((g, idx) => (
                  <div key={`grado-${idx}`} className="p-3 border rounded-md flex justify-between items-start gap-4">
                    <div>
                      <div className="text-sm font-medium">{g.tipoGrado || '-'} - {g.titulo || g.carrera || '-'}</div>
                      <div className="text-xs text-muted-foreground">{g.institucion || '-'} · {g.fechaObtencion || '-'}</div>
                    </div>
                    {isEditing && (
                      <div>
                        <Button variant="outline" onClick={() => setGrados(prev => prev.filter((_, i) => i !== idx))}>Eliminar</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Grado</Label>
                    <Select value={newGrado.codGrado} onValueChange={(v) => setNewGrado({ ...newGrado, codGrado: v })}>
                      <SelectTrigger>
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
                    <Label>Carrera/Título</Label>
                    <Input value={newGrado.carrera} onChange={(e) => setNewGrado({ ...newGrado, carrera: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Institución</Label>
                    <Input value={newGrado.institucion} onChange={(e) => setNewGrado({ ...newGrado, institucion: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de Obtención</Label>
                    <Input type="date" value={newGrado.fechaObtencion} onChange={(e) => setNewGrado({ ...newGrado, fechaObtencion: e.target.value })} />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button onClick={() => {
                      setGrados(prev => [...prev, { ...newGrado }]);
                      setNewGrado({ codCia: '', codGrado: '', codEmpleado: '', tipoGrado: '', carrera: '', titulo: '', institucion: '', fechaObtencion: '', documento: '' });
                    }}>
                      Agregar Grado
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Especializaciones</h3>

              {especializaciones.length === 0 && <div className="text-sm text-muted-foreground mb-2">No hay especializaciones registradas.</div>}

              <div className="space-y-2 mb-4">
                {especializaciones.map((e, idx) => (
                  <div key={`esp-${idx}`} className="p-3 border rounded-md flex justify-between items-start gap-4">
                    <div>
                      <div className="text-sm font-medium">{e.especialidad || '-'}</div>
                      <div className='text-xs text-muted-foreground'>{e.institucion || '-'} - {e.fechaObtencion || '-'} - {e.horasCapacitacion || '-'} horas</div>
                    </div>
                    {isEditing && (
                      <div>
                        <Button variant="outline" onClick={() => setEspecializaciones(prev => prev.filter((_, i) => i !== idx))}>Eliminar</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Especialidad</Label>
                    <Input value={newEspecializacion.especialidad} onChange={(e) => setNewEspecializacion({ ...newEspecializacion, especialidad: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas de Capacitación</Label>
                    <Input type="number" value={newEspecializacion.horasCapacitacion} onChange={(e) => setNewEspecializacion({ ...newEspecializacion, horasCapacitacion: e.target.value })} />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button onClick={() => {
                      setEspecializaciones(prev => [...prev, { ...newEspecializacion }]);
                      setNewEspecializacion({ codCia: '', codEspecialidad: '', codEmpleado: '', especialidad: '', certificado: '', institucion: '', fechaObtencion: '', horasCapacitacion: '' });
                    }}>
                      Agregar Especialización
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Experiencia Laboral</h3>

              {experiencias.length === 0 && <div className="text-sm text-muted-foreground mb-2">No hay experiencias registradas.</div>}

              <div className="space-y-2 mb-4">
                {experiencias.map((ex, idx) => (
                  <div key={`exp-${idx}`} className="p-3 border rounded-md flex justify-between items-start gap-4">
                    <div>
                      <div className="text-sm font-medium">{ex.empresa || '-'}</div>
                      <div className="text-xs text-muted-foreground">{ex.especialidad_laboral || '-'} · {ex.fecha_inicio_laboral || '-'} to {ex.fecha_fin_laboral || '-'}</div>
                    </div>
                    {isEditing && (
                      <div>
                        <Button variant="outline" onClick={() => setExperiencias(prev => prev.filter((_, i) => i !== idx))}>Eliminar</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input value={newExperiencia.empresa} onChange={(e) => setNewExperiencia({ ...newExperiencia, empresa: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Especialidad</Label>
                    <Input value={newExperiencia.especialidad_laboral} onChange={(e) => setNewExperiencia({ ...newExperiencia, especialidad_laboral: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Inicio</Label>
                    <Input type="date" value={newExperiencia.fecha_inicio_laboral} onChange={(e) => setNewExperiencia({ ...newExperiencia, fecha_inicio_laboral: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Fin</Label>
                    <Input type="date" value={newExperiencia.fecha_fin_laboral} onChange={(e) => setNewExperiencia({ ...newExperiencia, fecha_fin_laboral: e.target.value })} />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button onClick={() => {
                      setExperiencias(prev => [...prev, { ...newExperiencia }]);
                      setNewExperiencia({ empresa: '', especialidad_laboral: '', fecha_inicio_laboral: '', fecha_fin_laboral: '' });
                    }}>
                      Agregar Experiencia
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 justify-end mt-6">
          {editingItem && !isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
              <Pencil size={16} />
              Editar
            </Button>
          )}
          {editingItem && !isEditing ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => {
                if (editingItem) {
                  setIsEditing(false);
                } else {
                  onOpenChange(false);
                }
              }}>
                {editingItem ? 'Cancelar' : 'Cerrar'}
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
