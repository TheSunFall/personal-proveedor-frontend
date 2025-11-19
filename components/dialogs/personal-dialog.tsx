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

  // Agregar estados para rastrear items eliminados
  const [deletedGrados, setDeletedGrados] = useState<any[]>([]);
  const [deletedEspecializaciones, setDeletedEspecializaciones] = useState<any[]>([]);
  const [deletedExperiencias, setDeletedExperiencias] = useState<any[]>([]);

  // Estados temporales para agregar nuevos ítems
const [newGrado, setNewGrado] = useState({   
  codCia: '',   
  codGrado: '',  // Esto será generado automáticamente  
  codEmpleado: '',   
  tipoGrado: '',  
  carrera: '',   
  titulo: '',   
  institucion: '',   
  fechaObtencion: '',   
  documento: ''   
});
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

        // Inicializar experiencias laborales  
        if (Array.isArray(editingItem.experienciasLaborales)) {    
          // Mapear los campos del backend a los campos del frontend  
          setExperiencias(editingItem.experienciasLaborales.map((exp: any) => ({  
            codCia: exp.codCia,  
            codExperiencia: exp.codExperiencia,  
            codEmpleado: exp.codEmpleado,  
            empresa: exp.empresa || '',  
            especialidad_laboral: exp.especialidad || '',  // Backend usa 'especialidad', frontend usa 'especialidad_laboral'  
            fecha_inicio_laboral: exp.fechaInicio || '',   // Backend usa 'fechaInicio', frontend usa 'fecha_inicio_laboral'  
            fecha_fin_laboral: exp.fechaFin || '',         // Backend usa 'fechaFin', frontend usa 'fecha_fin_laboral'  
          })));  
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
    
      if (!editingItem) {  
        // PASO 1: Crear PERSONA primero  
        const personaPayload = {  
          codCia: 1,  
          // codPersona ya no es necesario - el backend lo generará  
          tipPersona: 'E',  
          desPersona: formData.nombre_completo,  
          desCorta: formData.nombre_completo.substring(0, 30),  
          descAlterna: formData.nombre_completo,  
          desCortaAlt: formData.nombre_completo.substring(0, 10),  
          vigente: '1'  
        };
    
        const personaRes = await fetch(API_ENDPOINTS.PERSONA, {  
          method: 'POST',  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify(personaPayload),  
        });  
          
        if (!personaRes.ok) {  
          const errorText = await personaRes.text();  
          console.error('Error del backend:', errorText);  
          alert(`Error al crear la persona: ${errorText}`);  
          return;  
        }
    
        const personaCreada = await personaRes.json();  
          
        // PASO 2: Crear EMPLEADO con TODOS los campos requeridos  
        const empleadoPayload = {    
          codCia: 1,    
          codEmpleado: personaCreada.codPersona,    
          direcc: formData.direccion || 'Sin dirección',    
          celular: formData.telefono || '000000000',    
          email: formData.email || 'sin-email@example.com',    
          dni: formData.documento_identidad || '00000000',    
          fecNac: formData.fecha_nacimiento || new Date().toISOString().split('T')[0],    
          hobby: 'Sin especificar',  // NO usar string vacío ''  
          nroCIP: '0000000000',    
          fecCIPVig: new Date().toISOString().split('T')[0],    
          licCond: '0',    
          flgEmplIEA: '0',    
          observac: 'Sin observaciones',  // NO usar string vacío ''  
          codCargo: 1,    
          vigente: '1'    
        };  
    
        const empleadoRes = await fetch(API_ENDPOINTS.EMPLEADO, {      
          method: 'POST',      
          headers: { 'Content-Type': 'application/json' },      
          body: JSON.stringify(empleadoPayload),      
        });      
          
        console.log('Status del empleado:', empleadoRes.status);  
        console.log('Headers:', empleadoRes.headers);  
          
        if (!empleadoRes.ok) {      
          const errorText = await empleadoRes.text();      
          console.error('Error completo del backend:', errorText);  
          console.error('Status code:', empleadoRes.status);  
          console.error('Status text:', empleadoRes.statusText);  
            
          // Intentar parsear como JSON si es posible  
          try {  
            const errorJson = JSON.parse(errorText);  
            console.error('Error JSON:', errorJson);  
            alert(`Error al crear el empleado: ${errorJson.message || errorText}`);  
          } catch {  
            alert(`Error al crear el empleado (${empleadoRes.status}): ${errorText || empleadoRes.statusText}`);  
          }  
          return;      
        }
    
        const empleadoCreado = await empleadoRes.json();  
        const codEmpleado = empleadoCreado.codEmpleado;  
    
        // PASO 3: Crear grados académicos  
        for (const grado of grados) {  
          await fetch(API_ENDPOINTS.GRADO, {  
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify({  
              ...grado,  
              codCia: 1,  
              codEmpleado: codEmpleado  
            })  
          });  
        }  
    
        // PASO 4: Crear especializaciones  
        for (const esp of especializaciones) {  
          await fetch(API_ENDPOINTS.ESPECIALIDAD, {  
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify({  
              ...esp,  
              codCia: 1,  
              codEmpleado: codEmpleado  
            })  
          });  
        }  
    
        // PASO 5: Crear experiencias laborales  
        for (const exp of experiencias) {  
          await fetch(API_ENDPOINTS.EXPERIENCIA, {  
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify({  
              ...exp,  
              codCia: 1,  
              codEmpleado: codEmpleado  
            })  
          });  
        }  
    
      } else {  
      // Lógica de actualización
      
      // ELIMINAR items marcados
      for (const grado of deletedGrados) {  
        if (grado.codGrado && typeof grado.codGrado === 'number') {  
          await fetch(`${API_ENDPOINTS.GRADO}/1/${grado.codGrado}/${editingItem.codEmpleado}`, {  
            method: 'DELETE',  
          }).catch(err => console.error('Error eliminando grado:', err));  
        }  
      }

      for (const esp of deletedEspecializaciones) {  
        if (esp.codEspecialidad && typeof esp.codEspecialidad === 'number') {  
          await fetch(`${API_ENDPOINTS.ESPECIALIDAD}/1/${esp.codEspecialidad}/${editingItem.codEmpleado}`, {  
            method: 'DELETE',  
          }).catch(err => console.error('Error eliminando especialidad:', err));  
        }  
      }

      for (const exp of deletedExperiencias) {  
        if (exp.codExperiencia && typeof exp.codExperiencia === 'number') {  
          await fetch(`${API_ENDPOINTS.EXPERIENCIA}/1/${exp.codExperiencia}/${editingItem.codEmpleado}`, {  
            method: 'DELETE',  
          }).catch(err => console.error('Error eliminando experiencia:', err));  
        }  
      }

      // Actualizar empleado
      const empleadoPayload = {    
        codCia: 1,    
        codEmpleado: editingItem.codEmpleado,    
        direcc: formData.direccion,    
        celular: formData.telefono,    
        email: formData.email,    
        dni: formData.documento_identidad,    
        fecNac: formData.fecha_nacimiento,    
        hobby: editingItem.hobby || 'Sin especificar',    
        nroCIP: editingItem.nroCIP || '0000000000',    
        fecCIPVig: editingItem.fecCIPVig || new Date().toISOString().split('T')[0],    
        licCond: editingItem.licCond || '0',    
        flgEmplIEA: editingItem.flgEmplIEA || '0',    
        observac: editingItem.observac || 'Sin observaciones',    
        codCargo: editingItem.codCargo || 1,    
        vigente: '1'    
      };    
      
      const empleadoRes = await fetch(`${API_ENDPOINTS.EMPLEADO}/1/${editingItem.codEmpleado}`, {    
        method: 'PUT',    
        headers: { 'Content-Type': 'application/json' },    
        body: JSON.stringify(empleadoPayload),    
      });    
      
      if (!empleadoRes.ok) {    
        alert('Error al actualizar el empleado');    
        return;    
      }    
      
      // Actualizar persona    
      const personaPayload = {    
        codCia: 1,    
        codPersona: editingItem.codEmpleado,    
        tipPersona: 'E',    
        desPersona: formData.nombre_completo,    
        desCorta: formData.nombre_completo.substring(0, 30),    
        descAlterna: formData.nombre_completo,    
        desCortaAlt: formData.nombre_completo.substring(0, 10),    
        vigente: '1'    
      };    
      
      await fetch(`${API_ENDPOINTS.PERSONA}/1/${editingItem.codEmpleado}`, {    
        method: 'PUT',    
        headers: { 'Content-Type': 'application/json' },    
        body: JSON.stringify(personaPayload),    
      });    
      
      // ACTUALIZAR grados académicos        
      for (const grado of grados) {          
        if (grado.codGrado && typeof grado.codGrado === 'number') {    
          // UPDATE: incluye codGrado para registros existentes    
          const gradoPayload = {          
            codCia: 1,          
            codGrado: grado.codGrado,  // Incluir aquí para UPDATE  
            codEmpleado: editingItem.codEmpleado,          
            tipoGrado: grado.tipoGrado || 'LICENCIATURA',        
            carrera: grado.carrera || '',          
            titulo: grado.titulo || grado.carrera || '',          
            institucion: grado.institucion || '',          
            fechaObtencion: grado.fechaObtencion || null,          
            documento: null          
          };  
            
          const response = await fetch(`${API_ENDPOINTS.GRADO}/1/${grado.codGrado}/${editingItem.codEmpleado}`, {        
            method: 'PUT',        
            headers: { 'Content-Type': 'application/json' },        
            body: JSON.stringify(gradoPayload),        
          });  
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error actualizando grado:', response.status, errorText);
            alert(`Error al actualizar grado: ${errorText}`);
          }
        } else {  
          // POST: no incluir codGrado - el backend lo generará  
          const gradoPayload = {          
            codCia: 1,          
            // NO incluir codGrado aquí  
            codEmpleado: editingItem.codEmpleado,          
            tipoGrado: grado.tipoGrado || 'LICENCIATURA',        
            carrera: grado.carrera || '',          
            titulo: grado.titulo || grado.carrera || '',          
            institucion: grado.institucion || '',          
            fechaObtencion: grado.fechaObtencion || null,          
            documento: null          
          };  
            
          const response = await fetch(API_ENDPOINTS.GRADO, {        
            method: 'POST',        
            headers: { 'Content-Type': 'application/json' },        
            body: JSON.stringify(gradoPayload),        
          });  

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error creando grado:', response.status, errorText);
            alert(`Error al crear grado: ${errorText}`);
          }
        }        
      }        
          
      // ACTUALIZAR especializaciones      
      for (const esp of especializaciones) {          
        if (esp.codEspecialidad && typeof esp.codEspecialidad === 'number') {    
          // UPDATE: incluye codEspecialidad para registros existentes    
          const espPayload = {          
            codCia: 1,          
            codEspecialidad: esp.codEspecialidad,  // Incluir aquí para UPDATE  
            codEmpleado: editingItem.codEmpleado,          
            especialidad: esp.especialidad || '',          
            certificado: null,          
            institucion: esp.institucion || '',          
            fechaObtencion: esp.fechaObtencion || null,          
            horasCapacitacion: parseInt(esp.horasCapacitacion) || 0        
          };  
            
          const response = await fetch(`${API_ENDPOINTS.ESPECIALIDAD}/1/${esp.codEspecialidad}/${editingItem.codEmpleado}`, {          
            method: 'PUT',          
            headers: { 'Content-Type': 'application/json' },          
            body: JSON.stringify(espPayload),          
          });        
                  
          if (!response.ok) {        
            const errorText = await response.text();        
            console.error('Error actualizando especialidad:', errorText);        
            alert(`Error al actualizar especialidad: ${errorText}`);      
          }        
        } else {    
          // POST: no incluir codEspecialidad - el backend lo generará    
          const espPayload = {          
            codCia: 1,          
            // NO incluir codEspecialidad aquí  
            codEmpleado: editingItem.codEmpleado,          
            especialidad: esp.especialidad || '',          
            certificado: null,          
            institucion: esp.institucion || '',          
            fechaObtencion: esp.fechaObtencion || null,          
            horasCapacitacion: parseInt(esp.horasCapacitacion) || 0        
          };  
            
          const response = await fetch(API_ENDPOINTS.ESPECIALIDAD, {          
            method: 'POST',          
            headers: { 'Content-Type': 'application/json' },          
            body: JSON.stringify(espPayload),          
          });        
                  
          if (!response.ok) {        
            const errorText = await response.text();        
            console.error('Error creando especialidad:', errorText);        
            alert(`Error al crear especialidad: ${errorText}`);      
          }        
        }          
      }

      // ACTUALIZAR experiencias laborales        
      for (const exp of experiencias) {          
        if (exp.codExperiencia && typeof exp.codExperiencia === 'number') {    
          // UPDATE: incluye codExperiencia para registros existentes    
          const expPayload = {          
            codCia: 1,          
            codExperiencia: exp.codExperiencia,  // Incluir aquí para UPDATE  
            codEmpleado: editingItem.codEmpleado,          
            empresa: exp.empresa || '',          
            especialidad: exp.especialidad_laboral || '',        
            fechaInicio: exp.fecha_inicio_laboral || null,          
            fechaFin: exp.fecha_fin_laboral || null,          
            certificado: null          
          };  
            
          const response = await fetch(`${API_ENDPOINTS.EXPERIENCIA}/1/${exp.codExperiencia}/${editingItem.codEmpleado}`, {          
            method: 'PUT',          
            headers: { 'Content-Type': 'application/json' },          
            body: JSON.stringify(expPayload),          
          });        
                  
          if (!response.ok) {        
            const errorText = await response.text();        
            console.error('Error actualizando experiencia:', errorText);        
            alert(`Error al actualizar experiencia: ${errorText}`);      
          }        
        } else {    
          // POST: no incluir codExperiencia - el backend lo generará    
          const expPayload = {          
            codCia: 1,          
            // NO incluir codExperiencia aquí  
            codEmpleado: editingItem.codEmpleado,          
            empresa: exp.empresa || '',          
            especialidad: exp.especialidad_laboral || '',        
            fechaInicio: exp.fecha_inicio_laboral || null,          
            fechaFin: exp.fecha_fin_laboral || null,          
            certificado: null          
          };  
            
          const response = await fetch(API_ENDPOINTS.EXPERIENCIA, {          
            method: 'POST',          
            headers: { 'Content-Type': 'application/json' },          
            body: JSON.stringify(expPayload),          
          });        
                  
          if (!response.ok) {        
            const errorText = await response.text();        
            console.error('Error creando experiencia:', errorText);        
            alert(`Error al crear experiencia: ${errorText}`);      
          }        
        }          
      }
      
      onSuccess();  
      onOpenChange(false);  
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
                        <Button variant="outline" onClick={() => {
                          const gradoToDelete = grados[idx];
                          if (gradoToDelete.codGrado) {
                            setDeletedGrados(prev => [...prev, gradoToDelete]);
                          }
                          setGrados(prev => prev.filter((_, i) => i !== idx));
                        }}>Eliminar</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">  
                    <Label>Tipo de Grado</Label>  
                    <Select   
                      value={newGrado.tipoGrado}  
                      onValueChange={(v) => setNewGrado({ ...newGrado, tipoGrado: v })}  
                    >  
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
                      setGrados(prev => [...prev, {   
                        ...newGrado,  
                        tipoGrado: newGrado.tipoGrado,  
                        titulo: newGrado.carrera  
                      }]);  
                      setNewGrado({   
                        codCia: '',   
                        codGrado: '',   
                        codEmpleado: '',   
                        tipoGrado: '',  
                        carrera: '',   
                        titulo: '',   
                        institucion: '',   
                        fechaObtencion: '',   
                        documento: ''   
                      });  
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
                        <Button variant="outline" onClick={() => {
                          const espToDelete = especializaciones[idx];
                          if (espToDelete.codEspecialidad) {
                            setDeletedEspecializaciones(prev => [...prev, espToDelete]);
                          }
                          setEspecializaciones(prev => prev.filter((_, i) => i !== idx));
                        }}>Eliminar</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="grid grid-cols-2 gap-4">  
                  <div className="space-y-2">  
                    <Label>Especialidad</Label>  
                    <Input   
                      value={newEspecializacion.especialidad}   
                      onChange={(e) => setNewEspecializacion({ ...newEspecializacion, especialidad: e.target.value })}   
                    />  
                  </div>  
                  <div className="space-y-2">  
                    <Label>Institución</Label>  
                    <Input   
                      value={newEspecializacion.institucion}   
                      onChange={(e) => setNewEspecializacion({ ...newEspecializacion, institucion: e.target.value })}   
                    />  
                  </div>  
                  <div className="space-y-2">  
                    <Label>Fecha de Obtención</Label>  
                    <Input   
                      type="date"  
                      value={newEspecializacion.fechaObtencion}   
                      onChange={(e) => setNewEspecializacion({ ...newEspecializacion, fechaObtencion: e.target.value })}   
                    />  
                  </div>  
                  <div className="space-y-2">  
                    <Label>Horas de Capacitación</Label>  
                    <Input   
                      type="number"   
                      value={newEspecializacion.horasCapacitacion}   
                      onChange={(e) => setNewEspecializacion({ ...newEspecializacion, horasCapacitacion: e.target.value })}   
                    />  
                  </div>  
                  <div className="col-span-2 flex justify-end">  
                    <Button onClick={() => {  
                      setEspecializaciones(prev => [...prev, { ...newEspecializacion }]);  
                      setNewEspecializacion({   
                        codCia: '',   
                        codEspecialidad: '',   
                        codEmpleado: '',   
                        especialidad: '',   
                        certificado: '',   
                        institucion: '',  
                        fechaObtencion: '',  
                        horasCapacitacion: ''   
                      });  
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
                      <div className="text-xs text-muted-foreground">{ex.especialidad_laboral || '-'} · {ex.fecha_inicio_laboral || '-'}</div>
                    </div>
                    {isEditing && (
                      <div>
                        <Button variant="outline" onClick={() => {
                          const expToDelete = experiencias[idx];
                          if (expToDelete.codExperiencia) {
                            setDeletedExperiencias(prev => [...prev, expToDelete]);
                          }
                          setExperiencias(prev => prev.filter((_, i) => i !== idx));
                        }}>Eliminar</Button>
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