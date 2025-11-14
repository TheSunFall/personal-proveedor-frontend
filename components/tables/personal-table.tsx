'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PersonalTableProps {
  data: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export function PersonalTable({ data, loading, onEdit, onDelete }: PersonalTableProps) {
  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No hay empleados registrados</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="pb-3 font-semibold text-muted-foreground">Nombre Completo</th>
            <th className="pb-3 font-semibold text-muted-foreground">Cargo</th>
            <th className="pb-3 font-semibold text-muted-foreground">Área</th>
            <th className="pb-3 font-semibold text-muted-foreground">Email</th>
            <th className="pb-3 font-semibold text-muted-foreground">Estado</th>
            <th className="pb-3 font-semibold text-muted-foreground text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.cod_empleado} className="border-b hover:bg-muted/50">
              <td className="py-3">{item.nombre_completo}</td>
              <td className="py-3 text-muted-foreground">{item.nombre_cargo || '-'}</td>
              <td className="py-3 text-muted-foreground">{item.nombre_area || '-'}</td>
              <td className="py-3 text-muted-foreground">{item.email || '-'}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.estado === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.estado === '1' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="py-3 text-right flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="gap-2"
                >
                  <Pencil size={16} />
                  Editar
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
