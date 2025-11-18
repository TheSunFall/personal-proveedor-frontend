'use client';

import { Pencil, Trash2, Users, CheckSquare, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProyectoTableProps {
  data: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onTask: (item: any) => void;
}

export function ProyectoTable({ data, loading, onEdit, onDelete, onTask }: ProyectoTableProps) {
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
            <th className="pb-3 font-semibold text-muted-foreground">Nombre</th>
            <th className="pb-3 font-semibold text-muted-foreground">Cliente</th>
            <th className="pb-3 font-semibold text-muted-foreground">Presupuesto</th>
            <th className="pb-3 font-semibold text-muted-foreground">Inicio</th>
            <th className="pb-3 font-semibold text-muted-foreground">Estado</th>
            <th className="pb-3 font-semibold text-muted-foreground text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.codPyto} className="border-b hover:bg-muted/50">
              <td className="py-3 font-medium">{item.nombPyto?.substring(0, 40)}</td>
              <td className="py-3 text-muted-foreground">{item.cliente.desPersona || '-'}</td>
              <td className="py-3 font-medium">S/ {item.costoTotal?.toLocaleString('es-PE')}</td>
              <td className="py-3 text-muted-foreground">{item.fecReg.toLocaleString('es-PE')}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.codEstado === '003'
                  ? 'bg-green-100 text-green-800'
                  : item.codEstado === '002'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                  }`}>
                  {item.codEstado === "003"
                    ? "Completado"
                    : item.codEstado === '002'
                      ? 'En pausa'
                      : 'En ejecución'}
                </span>
              </td>
              <td className="py-3 text-right flex gap-1 justify-end">
                <Button variant="ghost" size="sm" title="Asignar recursos" className="text-cyan-600 hover:cursor-pointer hover:bg-cyan-600/20">
                  <Users size={16} />
                </Button>
                <Button variant="ghost" size="sm" title="Tareas" onClick={() => onTask(item)} className="text-purple-500 hover:cursor-pointer hover:bg-purple-500/15">
                  <CheckSquare size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="gap-2"
                >
                  <Eye size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item)}
                  className="hover:cursor-pointer text-destructive-foreground hover:bg-destructive"
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
