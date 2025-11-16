'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
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
            <th className="pb-3 font-semibold text-muted-foreground">DNI</th>
            <th className="pb-3 font-semibold text-muted-foreground">Dirección</th>
            <th className="pb-3 font-semibold text-muted-foreground">Email</th>
            <th className="pb-3 font-semibold text-muted-foreground text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.codEmpleado} className="border-b hover:bg-muted/50">
              <td className="py-3">{item.persona.desPersona}</td>
              <td className="py-3 text-muted-foreground">{item.dni || '-'}</td>
              <td className="py-3 text-muted-foreground">{item.direcc || '-'}</td>
              <td className="py-3 text-muted-foreground">{item.email || '-'}</td>
              <td className="py-3 text-right flex gap-2 justify-end">
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
