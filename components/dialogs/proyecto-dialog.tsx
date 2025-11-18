'use client';  
  
import { useState, useEffect } from 'react';  
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';  
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';  
import { Label } from '@/components/ui/label';  
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';  
import { Textarea } from '@/components/ui/textarea';  
import { API_ENDPOINTS } from '@/lib/config';  
  
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
    // Campos básicos    
    nombPyto: '',    
    codCliente: '',    
    emplJefeProy: 1,  
        
    // Campos de costo    
    valRefer: '',    
    costoDirecto: '',    
    costoGGen: '',    
    costoFinan: '',    
    impUtilidad: '',    
    costoTotSinIGV: '',    
    impIGV: '',    
    costoTotal: '',    
    costoPenalid: '',    
        
    // Campos de fechas    
    fecReg: new Date().toISOString().split('T')[0],    
    fecEstado: new Date().toISOString().split('T')[0],    
    fecViab: new Date().toISOString().split('T')[0],    
        
    // Campos de ubicación    
    codDpto: '01',    
    codProv: '01',    
    codDist: '01',    
        
    // Campos de control    
    codCia1: 1,    
    ciaContrata: 1,    
    codCC: 1,    
    flgEmpConsorcio: '0',    
    codSNIP: '0000000000',    
    codFase: 1,    
    codNivel: 1,    
    codFuncion: '0001',    
    codSituacion: 1,    
    numInfor: 0,    
    numInforEntrg: 0,    
    estPyto: 1,    
    annoIni: new Date().getFullYear(),    
    annoFin: new Date().getFullYear() + 1,    
    codObjC: 1,    
    tabEstado: '001',    
    codEstado: '001',    
    observac: '',    
    vigente: '1',    
    rutaDoc: '',    
  });  
  
  useEffect(() => {  
    if (open) {  
      fetchClientes();  
      if (editingItem) {  
        // ✅ CORRECTO - Usar los campos reales del backend  
        setFormData({  
          nombPyto: editingItem.nombPyto || '',  
          codCliente: editingItem.codCliente || '',  
          emplJefeProy: editingItem.emplJefeProy || 1,  
          valRefer: editingItem.valRefer?.toString() || '',  
          costoDirecto: editingItem.costoDirecto?.toString() || '',  
          costoGGen: editingItem.costoGGen?.toString() || '',  
          costoFinan: editingItem.costoFinan?.toString() || '',  
          impUtilidad: editingItem.impUtilidad?.toString() || '',  
          costoTotSinIGV: editingItem.costoTotSinIGV?.toString() || '',  
          impIGV: editingItem.impIGV?.toString() || '',  
          costoTotal: editingItem.costoTotal?.toString() || '',  
          costoPenalid: editingItem.costoPenalid?.toString() || '',  
          fecReg: editingItem.fecReg ? new Date(editingItem.fecReg).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],  
          fecEstado: editingItem.fecEstado ? new Date(editingItem.fecEstado).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],  
          fecViab: editingItem.fecViab ? new Date(editingItem.fecViab).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],  
          codDpto: editingItem.codDpto || '01',  
          codProv: editingItem.codProv || '01',  
          codDist: editingItem.codDist || '01',  
          codCia1: editingItem.codCia1 || 1,  
          ciaContrata: editingItem.ciaContrata || 1,  
          codCC: editingItem.codCC || 1,  
          flgEmpConsorcio: editingItem.flgEmpConsorcio || '0',  
          codSNIP: editingItem.codSNIP || '0000000000',  
          codFase: editingItem.codFase || 1,  
          codNivel: editingItem.codNivel || 1,  
          codFuncion: editingItem.codFuncion || '0001',  
          codSituacion: editingItem.codSituacion || 1,  
          numInfor: editingItem.numInfor || 0,  
          numInforEntrg: editingItem.numInforEntrg || 0,  
          estPyto: editingItem.estPyto || 1,  
          annoIni: editingItem.annoIni || new Date().getFullYear(),  
          annoFin: editingItem.annoFin || new Date().getFullYear() + 1,  
          codObjC: editingItem.codObjC || 1,  
          tabEstado: editingItem.tabEstado || '001',  
          codEstado: editingItem.codEstado || '001',  
          observac: editingItem.observac || '',  
          vigente: editingItem.vigente || '1',  
          rutaDoc: editingItem.rutaDoc || '',  
        });  
      }  
    }  
  }, [open, editingItem]);  
  
  const fetchClientes = async () => {  
    try {  
      const [clientesRes, personasRes] = await Promise.all([  
        fetch(API_ENDPOINTS.CLIENTE),  
        fetch(`${API_ENDPOINTS.PERSONA}`)  
      ]);  
        
      if (clientesRes.ok && personasRes.ok) {  
        const clientesData = await clientesRes.json();  
        const personasData = await personasRes.json();  
          
        // Combinar clientes con sus personas  
        const clientesConNombre = clientesData.map((cliente: any) => {  
          const persona = personasData.find((p: any) =>   
            p.codCia === cliente.codCia &&   
            p.codPersona === cliente.codCliente &&  
            p.tipPersona === 'C'  
          );  
          return {  
            ...cliente,  
            desPersona: persona?.desPersona || 'Sin nombre'  
          };  
        });  
          
        setClientes(clientesConNombre);  
      }  
    } catch (error) {  
      console.error('Error fetching clientes:', error);  
    }  
  };
  
  const handleSubmit = async () => {  
    try {  
      setLoading(true);  
  
      //  Convertir fechas a formato SQL Date (YYYY-MM-DD)  
      const payload = {  
        codCia: 1,  
        nombPyto: formData.nombPyto,  
        codCliente: Number(formData.codCliente),  
        emplJefeProy: formData.emplJefeProy,  
        valRefer: parseFloat(formData.valRefer) || 0,  
        costoDirecto: parseFloat(formData.costoDirecto) || 0,  
        costoGGen: parseFloat(formData.costoGGen) || 0,  
        costoFinan: parseFloat(formData.costoFinan) || 0,  
        impUtilidad: parseFloat(formData.impUtilidad) || 0,  
        costoTotSinIGV: parseFloat(formData.costoTotSinIGV) || 0,  
        impIGV: parseFloat(formData.impIGV) || 0,  
        costoTotal: parseFloat(formData.costoTotal) || 0,  
        costoPenalid: parseFloat(formData.costoPenalid) || 0,  
        //  Enviar fechas como strings YYYY-MM-DD, no ISO timestamps  
        fecReg: formData.fecReg,  
        fecEstado: formData.fecEstado,  
        fecViab: formData.fecViab,  
        codDpto: formData.codDpto,  
        codProv: formData.codProv,  
        codDist: formData.codDist,  
        codCia1: formData.codCia1,  
        ciaContrata: formData.ciaContrata,  
        codCC: formData.codCC,  
        flgEmpConsorcio: formData.flgEmpConsorcio,  
        codSNIP: formData.codSNIP,  
        codFase: formData.codFase,  
        codNivel: formData.codNivel,  
        codFuncion: formData.codFuncion,  
        codSituacion: formData.codSituacion,  
        numInfor: formData.numInfor,  
        numInforEntrg: formData.numInforEntrg,  
        estPyto: formData.estPyto,  
        annoIni: formData.annoIni,  
        annoFin: formData.annoFin,  
        codObjC: formData.codObjC,  
        tabEstado: formData.tabEstado,  
        codEstado: formData.codEstado,  
        observac: formData.observac,  
        vigente: formData.vigente,  
        rutaDoc: formData.rutaDoc,  
        logoProy: null,  
      };  
  
      const method = editingItem ? 'PUT' : 'POST';  
      const url = editingItem  
        ? `${API_ENDPOINTS.PROYECTO}/1/${editingItem.codPyto}`  
        : `${API_ENDPOINTS.PROYECTO}`;  
  
      const res = await fetch(url, {  
        method,  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify(payload),  
      });  
  
      if (!res.ok) {  
        const errorText = await res.text();  
        console.error('Error del backend (status ' + res.status + '):', errorText);  
        console.log('Payload enviado:', JSON.stringify(payload, null, 2));  
        alert(`Error al guardar el proyecto (${res.status}): ${errorText}`);  
        return;  
      }
  
      onSuccess();  
      onOpenChange(false);  
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
              <div className="space-y-2 col-span-2">  
                <Label htmlFor="nombPyto">Nombre del Proyecto *</Label>  
                <Input  
                  id="nombPyto"  
                  value={formData.nombPyto}  
                  onChange={(e) => setFormData({ ...formData, nombPyto: e.target.value })}  
                  maxLength={1000}  
                  required  
                />  
              </div>  
    
              <div className="space-y-2">  
                <Label htmlFor="codCliente">Cliente *</Label>  
                <Select  
                  value={formData.codCliente ? String(formData.codCliente) : ''}  
                  onValueChange={(value) => setFormData({ ...formData, codCliente: value })}  
                >  
                  <SelectTrigger id="codCliente" className="w-full">  
                    <SelectValue placeholder="Seleccionar cliente" />  
                  </SelectTrigger>  
                  <SelectContent>  
                    {clientes.map((c) => (  
                      <SelectItem   
                        key={c.codCliente}   
                        value={String(c.codCliente)}  
                        className="truncate max-w-full"  
                      >  
                        <span className="truncate block">  
                          {c.persona?.desPersona || c.desPersona || 'Sin nombre'}  
                        </span>  
                      </SelectItem>  
                    ))}  
                  </SelectContent>  
                </Select>  
              </div>
    
              <div className="space-y-2">  
                <Label htmlFor="fecReg">Fecha de Registro *</Label>  
                <Input  
                  id="fecReg"  
                  type="date"  
                  value={formData.fecReg}  
                  onChange={(e) => setFormData({ ...formData, fecReg: e.target.value })}  
                  required  
                />  
              </div>  
    
              <div className="space-y-2">  
                <Label htmlFor="valRefer">Valor Referencial (S/)</Label>  
                <Input  
                  id="valRefer"  
                  type="number"  
                  step="0.01"  
                  min="0"  
                  value={formData.valRefer}  
                  onChange={(e) => setFormData({ ...formData, valRefer: e.target.value })}  
                  placeholder="0.00"  
                />  
              </div>  
    
              <div className="space-y-2">  
                <Label htmlFor="costoTotal">Costo Total (S/)</Label>  
                <Input  
                  id="costoTotal"  
                  type="number"  
                  step="0.01"  
                  min="0"  
                  value={formData.costoTotal}  
                  onChange={(e) => setFormData({ ...formData, costoTotal: e.target.value })}  
                  placeholder="0.00"  
                />  
              </div>  
    
              <div className="space-y-2 col-span-2">  
                <Label htmlFor="observac">Observaciones</Label>  
                <Textarea  
                  id="observac"  
                  value={formData.observac}  
                  onChange={(e) => setFormData({ ...formData, observac: e.target.value })}  
                  rows={3}  
                  maxLength={500}  
                  placeholder="Observaciones adicionales del proyecto..."  
                />  
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
