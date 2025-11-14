'use client';

import { Pencil, Trash2, Users, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProyectoTableProps {
  data: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export function ProyectoTable({ data, loading, onEdit, onDelete }: ProyectoTableProps) {
  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No hay proyectos registrados</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="pb-3 font-semibold text-muted-foreground">Código</th>
            <th className="pb-3 font-semibold text-muted-foreground">Nombre</th>
            <th className="pb-3 font-semibold text-muted-foreground">Cliente</th>
            <th className="pb-3 font-semibold text-muted-foreground">Presupuesto</th>
            <th className="pb-3 font-semibold text-muted-foreground">Inicio</th>
            <th className="pb-3 font-semibold text-muted-foreground">Estado</th>
            <th className="pb-3 font-semibold text-muted-foreground text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.cod_pyto} className="border-b hover:bg-muted/50">
              <td className="py-3 font-medium">{item.codigo}</td>
              <td className="py-3">{item.nombre?.substring(0, 40)}</td>
              <td className="py-3 text-muted-foreground">{item.nombre_cliente || '-'}</td>
              <td className="py-3 font-medium">S/ {item.monto_total?.toLocaleString('es-PE')}</td>
              <td className="py-3 text-muted-foreground">{item.fecha_inicio}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.estado === 'COMPLETADO' 
                    ? 'bg-green-100 text-green-800'
                    : item.estado === 'EN_PROGRESO'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.estado}
                </span>
              </td>
              <td className="py-3 text-right flex gap-1 justify-end">
                <Button variant="ghost" size="sm" title="Asignar recursos" className="text-blue-600">
                  <Users size={16} />
                </Button>
                <Button variant="ghost" size="sm" title="Tareas" className="text-purple-600">
                  <CheckSquare size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="gap-1"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
