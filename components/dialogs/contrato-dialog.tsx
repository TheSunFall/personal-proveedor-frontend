'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { API_ENDPOINTS } from '@/lib/config';
import { Combobox } from '@/components/ui/combobox';
import { FileUploadPdf } from '@/components/file-upload-pdf';
import { Search } from 'lucide-react';

interface ContratoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    codProveedor: any;
    codPyto: any;
    onSuccess: () => void;
}

export function ContratoDialog({ open, onOpenChange, codProveedor, codPyto, onSuccess }: ContratoDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        codProveedor: '',
        numeroContrato: '-' + 'PYT' + codPyto + 'PRV' + codProveedor.toString(),
        tipoContrato: 'SUMINISTROS',
        fechaInicio: '',
        fechaFin: '',
        montoTotal: '',
        moneda: 'PEN',
        documentoContrato: null as File | null
    });

    useEffect(() => {
        setFormData({ ...formData, numeroContrato: formData.fechaInicio + '-' + 'PYT' + codPyto + 'PRV' + codProveedor.toString() })
        console.log(formData)
    }, [formData.fechaInicio, codProveedor, codPyto])

    const handleFileChange = useCallback((file: File | null) => {
        setFormData(prev => ({ ...prev, documentoContrato: file }));
    }, []);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const url = `${API_ENDPOINTS.CONTRATO}`;

            let documentoBase64 = '';
            if (formData.documentoContrato) {
                documentoBase64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(formData.documentoContrato!);
                });
            }

            // Enviar la cadena base64 (sin prefijo data:...;base64,) como String.
            // Jackson en Spring Boot decodifica automáticamente un String base64 a byte[].
            const documentoString = documentoBase64
                ? (documentoBase64.split(',').pop() as string)
                : null;

            const payload = {
                codContrato: '13435', // TODO: reemplazar con endpoint de códigos
                codProveedor: codProveedor,
                numeroContrato: formData.numeroContrato,
                tipoContrato: formData.tipoContrato,
                fechaInicio: formData.fechaInicio,
                fechaFin: formData.fechaFin,
                montoTotal: formData.montoTotal,
                moneda: formData.moneda,
                documentoContrato: documentoString,
                codCia: 1,
                codPyto: codPyto
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
                alert('Error al guardar el contrato');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error al guardar el contrato');
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generar Contrato</DialogTitle>
                </DialogHeader>

                <div>
                    <div className="border-t pt-4 grid grid-cols-2 gap-4">
                        <div className="mt-2 space-y-2 col-span-2">
                            <Label htmlFor="nombre">Número de contrato</Label>
                            <div className='text-muted-foreground'>
                                {formData.numeroContrato}
                            </div>
                            <p className="mt-2 text-xs leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
                                El código se crea automáticamente.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="estado">Tipo</Label>
                            <Select value={formData.tipoContrato} onValueChange={(value) => setFormData({ ...formData, tipoContrato: value })}>
                                <SelectTrigger id="estado">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SUMINISTROS">Suministros</SelectItem>
                                    <SelectItem value="SERVICIOS">Servicios</SelectItem>
                                </SelectContent>
                            </Select>
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
                        <div className="space-y-2 flex flex-col">
                            <Label htmlFor="montoTotal" className='col-span-2'>Costo Total</Label>
                            <div className='flex gap-x-2'>
                                <Select value={formData.moneda} onValueChange={(value) => setFormData({ ...formData, moneda: value })}>
                                    <SelectTrigger id="moneda">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PEN">S/</SelectItem>
                                        <SelectItem value="USD">$</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    id="montoTotal"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.montoTotal}
                                    onChange={(e) => setFormData({ ...formData, montoTotal: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label>Documento del Contrato</Label>
                            <FileUploadPdf onFileChange={handleFileChange} />
                        </div>
                    </div>
                    <div className='mt-4 w-full flex justify-end'>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
