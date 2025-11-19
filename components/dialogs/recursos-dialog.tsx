'use client';  
  
import { useState, useEffect } from 'react';  
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';  
import { Button } from '@/components/ui/button';  
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';  
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check } from '@/components/ui/check';
import { API_ENDPOINTS } from '@/lib/config';  
import { Combobox } from '@/components/ui/combobox';  
import { ContratoDialog } from './contrato-dialog'; 
  
interface RecursosDialogProps {  
    open: boolean;  
    onOpenChange: (open: boolean) => void;  
    editingItem?: any;  
    onSuccess: () => void;  
}  
  
export function RecursosDialog({ open, onOpenChange, editingItem, onSuccess }: RecursosDialogProps) {  
    const [tab, setTab] = useState('personal');  
    const [loading, setLoading] = useState(false);  
    const [contratoDialog, setContratoDialog] = useState(false);  
      
    // Estados para listas  
    const [personal, setPersonal] = useState<any[]>([]);  
    const [proveedor, setProveedor] = useState<any[]>([]);  
      
    // Estados para formularios  
    const [formPersonal, setFormPersonal] = useState({  
        codCia: 1,  
        codPersonalProyecto: '', // TODO: endpoint de códigos  
        codEmpleado: '',  
        codCargo: 1,  
        codArea: 1,  
        fechaAsignacion: new Date().toISOString().split('T')[0],  
        horasAsignadas: ''  
    });  
      
    const [formProveedor, setFormProveedor] = useState({  
        codProveedor: ''  
    });  
      
    const [contratoSuccess, setContratoSuccess] = useState(false);  
        
        // ... resto del código  
        useEffect(() => {  
        if (open) {  
            fetchPersonal();  
            fetchProveedor();  
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
            console.error('Error fetching personal:', error);  
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
            console.error('Error fetching proveedores:', error);  
        }  
    };

    const handleSubmit = async () => {  
        try {  
            setLoading(true);  
            
            if (tab === 'personal') {  
                const payload = {  
                    codCia: 1,  
                    // Ya no necesitas codPersonalProyecto aquí - el backend lo generará  
                    codEmpleado: Number(formPersonal.codEmpleado),  
                    codPyto: Number(editingItem.codPyto),  
                    codCargo: 1,  
                    codArea: 1,  
                    fechaAsignacion: formPersonal.fechaAsignacion,  
                    horasAsignadas: parseFloat(formPersonal.horasAsignadas) || 0  
                };  
                
                const res = await fetch(`${API_ENDPOINTS.PERSONAL_PROYECTOS}`, {  
                    method: 'POST',  
                    headers: { 'Content-Type': 'application/json' },  
                    body: JSON.stringify(payload),  
                });  
                
                if (res.ok) {  
                    onSuccess();  
                    onOpenChange(false);  
                } else {  
                    const errorText = await res.text();  
                    console.error('Error del backend:', errorText);  
                    alert('Error al asignar personal: ' + errorText);  
                }  
            }  
        } catch (error) {  
            console.error('Error submitting form:', error);  
            alert('Error al asignar recursos');  
        } finally {  
            setLoading(false);  
        }  
    };
    return (  
        <Dialog open={open} onOpenChange={onOpenChange}>  
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">  
                <DialogHeader>  
                    <DialogTitle>Asignar Recursos al Proyecto</DialogTitle>  
                </DialogHeader>  
    
                <Tabs value={tab} onValueChange={setTab} className="w-full">  
                    <TabsList className="grid w-full grid-cols-2">  
                        <TabsTrigger value="personal">Personal</TabsTrigger>  
                        <TabsTrigger value="proveedor">Proveedor</TabsTrigger>  
                    </TabsList>  
    
                    {/* Pestaña Personal */}  
                    <TabsContent value="personal" className="space-y-4 py-4">  
                        <div className="space-y-4">  
                            <div className="space-y-2">  
                                <Label htmlFor="empleado">Seleccionar Personal</Label>  
                                <Combobox  
                                    items={personal.map(p => ({   
                                        value: p.codEmpleado,   
                                        label: p.persona?.desPersona   
                                    }))}  
                                    value={formPersonal.codEmpleado}  
                                    onChange={(v: string) => setFormPersonal({ ...formPersonal, codEmpleado: v })}  
                                    placeholder="Seleccionar personal..."  
                                />  
                            </div>  
                            
                            <div className="grid grid-cols-2 gap-4">  
                                <div className="space-y-2">  
                                    <Label htmlFor="fechaAsignacion">Fecha de Asignación</Label>  
                                    <Input  
                                        id="fechaAsignacion"  
                                        type="date"  
                                        value={formPersonal.fechaAsignacion}  
                                        onChange={(e) => setFormPersonal({ ...formPersonal, fechaAsignacion: e.target.value })}  
                                    />  
                                </div>  
                                
                                <div className="space-y-2">  
                                    <Label htmlFor="horasAsignadas">Horas Asignadas</Label>  
                                    <Input  
                                        id="horasAsignadas"  
                                        type="number"  
                                        value={formPersonal.horasAsignadas}  
                                        onChange={(e) => setFormPersonal({ ...formPersonal, horasAsignadas: e.target.value })}  
                                        placeholder="0"  
                                    />  
                                </div>  
                            </div>  
                        </div>
                         
                    </TabsContent>  
    
                    {/* Pestaña Proveedor */}  
                    <TabsContent value="proveedor" className="space-y-4 py-4">  
                       <div className="space-y-4">  
                        <div className="flex items-center justify-between">  
                            <Button   
                                variant="default"   
                                onClick={() => setContratoDialog(true)}   
                                disabled={!formProveedor.codProveedor || contratoSuccess}  
                            >  
                                Generar contrato...  
                            </Button>  
                            {contratoSuccess && (  
                                <p className="text-xs text-lime-500 flex items-center gap-2">  
                                    <Check size={16} /> Contrato registrado exitosamente  
                                </p>  
                            )}  
                        </div>  
                        
                        <div className="space-y-2">  
                            <Label htmlFor="proveedor">Seleccionar Proveedor</Label>  
                            <Combobox  
                                items={proveedor.map(p => ({   
                                    value: p.codProveedor,   
                                    label: p.persona?.desPersona   
                                }))}  
                                value={formProveedor.codProveedor}  
                                onChange={(v: string) => {  
                                    setFormProveedor({ codProveedor: v });  
                                    setContratoSuccess(false);  
                                }}  
                                placeholder="Seleccionar proveedor..."  
                            />  
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
    
            {/* ContratoDialog anidado */}  
            <ContratoDialog  
                open={contratoDialog}  
                onOpenChange={setContratoDialog}  
                codProveedor={formProveedor.codProveedor}  
                codPyto={editingItem?.codPyto}  
                onSuccess={() => {  
                    setContratoSuccess(true);  
                    setContratoDialog(false);  
                    onSuccess();  
                    onOpenChange(false);  
                }}  
            />  
        </Dialog>  
    );

}