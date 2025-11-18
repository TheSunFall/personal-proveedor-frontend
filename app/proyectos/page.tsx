'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, Users, CheckSquare } from 'lucide-react';
import { ProyectoDialog } from '@/components/dialogs/proyecto-dialog';
import { ProyectoTable } from '@/components/tables/proyecto-table';
import { API_ENDPOINTS } from '@/lib/config';
import { TareaDialog } from '@/components/dialogs/tareas-dialog';

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [filteredProyectos, setFilteredProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialog, setEditDialog] = useState(false);
  const [taskDialog, setTaskDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ENDPOINTS.PROYECTO}/completos`);
      if (res.ok) {
        const data = await res.json();
        setProyectos(data);
        setFilteredProyectos(data);
      }
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (searchTerm) {
      const filtered = proyectos.filter(p =>
        p.nombPyto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codPyto?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProyectos(filtered);
    } else {
      setFilteredProyectos(proyectos)
    }
  }, [searchTerm, proyectos]);

  const handleAdd = () => {
    setEditingItem(null);
    setEditDialog(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditDialog(true);
  };

  const handleTask = (item: any) => {
    setEditingItem(item);
    setTaskDialog(true)
  }

  const handleDelete = async (item: any) => {
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      try {
        const res = await fetch(`${API_ENDPOINTS.PROYECTO}/1/${item.cod_pyto}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchProyectos();
        }
      } catch (error) {
        console.error('Error deleting proyecto:', error);
      }
    }
  };

  const handleDialogClose = (callback: any) => {
    callback(false);
    setEditingItem(null);
    fetchProyectos();
  };

  return (
    <main className="h-full w-full min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Proyectos</h1>
            <p className="text-muted-foreground mt-2">Gestión de proyectos de construcción</p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus size={20} />
            Nuevo Proyecto
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Proyectos</CardTitle>
            <CardDescription>{filteredProyectos.length} proyectos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <ProyectoTable
              data={filteredProyectos}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTask={handleTask}
            />
          </CardContent>
        </Card>

        <ProyectoDialog
          open={editDialog}
          onOpenChange={setEditDialog}
          editingItem={editingItem}
          onSuccess={() => handleDialogClose(setEditDialog)}
        />

        <TareaDialog
          open={taskDialog}
          onOpenChange={setTaskDialog}
          editingItem={editingItem}
          onSuccess={() => handleDialogClose(setTaskDialog)}
        />
      </div>
    </main>
  );
}
