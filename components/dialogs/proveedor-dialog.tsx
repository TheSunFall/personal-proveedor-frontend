'use client';  
  
import { useState, useEffect } from 'react';  
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';  
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';  
import { Label } from '@/components/ui/label';  
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';  
import { Textarea } from '@/components/ui/textarea';  
import { API_ENDPOINTS } from '@/lib/config';  
  
interface ProveedorDialogProps {  
  open: boolean;  
  onOpenChange: (open: boolean) => void;  
  editingItem?: any;  
  onSuccess: () => void;  
}  
  
export function ProveedorDialog({ open, onOpenChange, editingItem, onSuccess }: ProveedorDialogProps) {  
  const [tab, setTab] = useState('general');  
  const [loading, setLoading] = useState(false);  
  const [isEditing, setIsEditing] = useState(false);  
  
  const [formData, setFormData] = useState({  
    nombre_completo: '',  
    nombre_corto: '',  
    ruc: '',  
    telefono: '',  
    email: '',  
    direccion: '',  
    estado: '1',  
  });  
  
  const [serviciosData, setServiciosData] = useState({  
    nombre_servicio: '',  
    descripcion: '',  
  });  
  
  useEffect(() => {  
    if (open) {  
      if (editingItem) {  
        setIsEditing(false);  
        setFormData({  
          nombre_completo: editingItem.persona?.desPersona || '',  
          nombre_corto: editingItem.persona?.desCorta || '',  
          ruc: editingItem.nroRuc || '',  
          telefono: editingItem.telefono || '',  
          email: editingItem.email || '',  
          direccion: editingItem.direccion || '',  
          estado: editingItem.vigente || '1',  
        });  
      } else {  
        setIsEditing(true);  
        setFormData({  
          nombre_completo: '',  
          nombre_corto: '',  
          ruc: '',  
          telefono: '',  
          email: '',  
          direccion: '',  
          estado: '1',  
        });  
        setServiciosData({  
          nombre_servicio: '',  
          descripcion: '',  
        });  
      }  
    }  
  }, [open, editingItem]);  
  
  const handleSubmit = async () => {  
    try {  
      setLoading(true);  
  
      if (!editingItem) {  
        // PASO 1: Crear PERSONA primero  
        const personaPayload = {  
          codCia: 1,  
          tipPersona: 'P',  
          desPersona: formData.nombre_completo.substring(0, 100),  
          desCorta: formData.nombre_corto.substring(0, 30),  
          descAlterna: formData.nombre_completo.substring(0, 100),  
          desCortaAlt: formData.nombre_corto.substring(0, 10),  
          vigente: formData.estado,  
        };  
  
        const personaRes = await fetch(API_ENDPOINTS.PERSONA, {  
          method: 'POST',  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify(personaPayload),  
        });  
  
        if (!personaRes.ok) {  
          const errorText = await personaRes.text();  
          console.error('Error al crear persona:', errorText);  
          alert(`Error al crear la persona: ${errorText}`);  
          return;  
        }  
  
        const personaCreada = await personaRes.json();  
  
        // PASO 2: Crear PROVEEDOR  
        const proveedorPayload = {  
          codCia: 1,  
          codProveedor: personaCreada.codPersona,  
          nroRuc: formData.ruc,  
          vigente: formData.estado,  
        };  
  
        const proveedorRes = await fetch(API_ENDPOINTS.PROVEEDOR, {  
          method: 'POST',  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify(proveedorPayload),  
        });  
  
        if (!proveedorRes.ok) {  
          const errorText = await proveedorRes.text();  
          console.error('Error al crear proveedor:', errorText);  
          alert(`Error al crear el proveedor: ${errorText}`);  
          return;  
        }  
  
        // PASO 3: Crear SERVICIO si se proporcionó  
        if (serviciosData.nombre_servicio) {  
          const servicioPayload = {  
            codCia: 1,  
            codServicio: Date.now() % 999999, // ID temporal basado en timestamp  
            codProveedor: personaCreada.codPersona,  
            nombreServicio: serviciosData.nombre_servicio,  
            descripcion: serviciosData.descripcion  
          };  
  
          const servicioRes = await fetch(API_ENDPOINTS.SERVICIO_PROVEEDOR, {  
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify(servicioPayload),  
          });  
  
          if (!servicioRes.ok) {  
            const errorText = await servicioRes.text();  
            console.error('Error al crear servicio:', errorText);  
            alert(`Advertencia: El proveedor se creó pero hubo un error al crear el servicio: ${errorText}`);  
          }  
        }  
      } else {  
        // CORRECCIÓN: URL con ambos parámetros codCia y codProveedor  
        const proveedorPayload = {  
          codCia: 1,  
          codProveedor: editingItem.codProveedor,  
          nroRuc: formData.ruc,  
          vigente: formData.estado,  
        };  
  
        const proveedorRes = await fetch(`${API_ENDPOINTS.PROVEEDOR}/1/${editingItem.codProveedor}`, {  
          method: 'PUT',  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify(proveedorPayload),  
        });  
  
        if (!proveedorRes.ok) {  
          const errorText = await proveedorRes.text();  
          console.error('Error al actualizar proveedor:', errorText);  
          alert(`Error al actualizar el proveedor: ${errorText}`);  
          return;  
        }  
  
        // Actualizar persona  
        const personaPayload = {  
          codCia: 1,  
          codPersona: editingItem.codProveedor,  
          tipPersona: 'P',  
          desPersona: formData.nombre_completo.substring(0, 100),  
          desCorta: formData.nombre_corto.substring(0, 30),  
          descAlterna: formData.nombre_completo.substring(0, 100),  
          desCortaAlt: formData.nombre_corto.substring(0, 10),  
          vigente: formData.estado,  
        };  
  
        const personaUpdateRes = await fetch(`${API_ENDPOINTS.PERSONA}/1/${editingItem.codProveedor}`, {  
          method: 'PUT',  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify(personaPayload),  
        });  
  
        if (!personaUpdateRes.ok) {  
          const errorText = await personaUpdateRes.text();  
          console.error('Error al actualizar persona:', errorText);  
        }  
  
        // Agregar servicio si se proporcionó  
        if (serviciosData.nombre_servicio) {  
          const servicioPayload = {  
            codCia: 1,  
            codServicio: Date.now() % 999999,  
            codProveedor: editingItem.codProveedor,  
            nombreServicio: serviciosData.nombre_servicio,  
            descripcion: serviciosData.descripcion  
          };  
  
          const servicioRes = await fetch(API_ENDPOINTS.SERVICIO_PROVEEDOR, {  
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify(servicioPayload),  
          });  
  
          if (!servicioRes.ok) {  
            const errorText = await servicioRes.text();  
            console.error('Error al crear servicio:', errorText);  
            alert(`Advertencia: Hubo un error al agregar el servicio: ${errorText}`);  
          }  
        }  
      }  
  
      onSuccess();  
      onOpenChange(false);  
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
          <DialogTitle>{editingItem ? 'Ver/Editar Proveedor' : 'Agregar Proveedor'}</DialogTitle>  
        </DialogHeader>  
  
        <Tabs value={tab} onValueChange={setTab} className="w-full">  
          <TabsList className="grid w-full grid-cols-2">  
            <TabsTrigger value="general">Información General</TabsTrigger>  
            <TabsTrigger value="servicios">Servicios</TabsTrigger>  
          </TabsList>  
  
          <TabsContent value="general" className="space-y-4 py-4">  
            <div className="grid grid-cols-2 gap-4">  
              <div className="space-y-2">  
                <Label htmlFor="nombre">Nombre Completo</Label>  
                <Input  
                  id="nombre"  
                  value={formData.nombre_completo}  
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}  
                  readOnly={!isEditing && !!editingItem}  
                />  
              </div>  
              <div className="space-y-2">  
                <Label htmlFor="nombre_corto">Nombre Corto</Label>  
                <Input  
                  id="nombre_corto"  
                  value={formData.nombre_corto}  
                  onChange={(e) => setFormData({ ...formData, nombre_corto: e.target.value })}  
                  readOnly={!isEditing && !!editingItem}  
                />  
              </div>  
              <div className="space-y-2">  
                <Label htmlFor="ruc">RUC</Label>  
                <Input  
                  id="ruc"  
                  value={formData.ruc}  
                  onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}  
                  readOnly={!isEditing && !!editingItem}  
                />  
              </div>  
              <div className="space-y-2">  
                <Label htmlFor="telefono">Teléfono</Label>  
                <Input  
                  id="telefono"  
                  value={formData.telefono}  
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}  
                  readOnly={!isEditing && !!editingItem}  
                />  
              </div>  
              <div className="space-y-2">  
                <Label htmlFor="email">Email</Label>  
                <Input  
                  id="email"  
                  type="email"  
                  value={formData.email}  
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}  
                  readOnly={!isEditing && !!editingItem}  
                />  
              </div>  
              <div className="space-y-2">  
                <Label htmlFor="estado">Estado</Label>  
                <select  
                  id="estado"  
                  value={formData.estado}  
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}  
                  className="w-full px-3 py-2 border rounded-md"  
                  disabled={!isEditing && !!editingItem}  
                >  
                  <option value="1">Activo</option>  
                  <option value="0">Inactivo</option>  
                </select>  
              </div>  
              <div className="space-y-2 col-span-2">  
                <Label htmlFor="direccion">Dirección</Label>  
                <Input  
                  id="direccion"  
                  value={formData.direccion}  
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}  
                  readOnly={!isEditing && !!editingItem}  
                />  
              </div>  
            </div>  
          </TabsContent>  
  
          <TabsContent value="servicios" className="space-y-4 py-4">  
            <div className="space-y-4">  
              <div className="space-y-2">  
                <Label htmlFor="nombre_servicio">Nombre del Servicio</Label>  
                <Input  
                  id="nombre_servicio"  
                  value={serviciosData.nombre_servicio}  
                  onChange={(e) => setServiciosData({ ...serviciosData, nombre_servicio: e.target.value })}  
                  disabled={!isEditing && !!editingItem}  
                />  
              </div>  
              <div className="space-y-2">  
                <Label htmlFor="descripcion_servicio">Descripción</Label>  
                <Textarea  
                  id="descripcion_servicio"  
                  value={serviciosData.descripcion}  
                  onChange={(e) => setServiciosData({ ...serviciosData, descripcion: e.target.value })}  
                  rows={4}  
                  disabled={!isEditing && !!editingItem}  
                />  
              </div>  
            </div>  
          </TabsContent>  
        </Tabs>  

        <div className="flex gap-3 justify-end mt-6">  
          {editingItem && !isEditing && (  
            <Button onClick={() => setIsEditing(true)} variant="outline">  
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
