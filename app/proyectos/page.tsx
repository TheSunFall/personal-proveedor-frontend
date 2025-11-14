'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, Users, CheckSquare } from 'lucide-react';
import { ProyectoDialog } from '@/components/dialogs/proyecto-dialog';
import { ProyectoTable } from '@/components/tables/proyecto-table';

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [filteredProyectos, setFilteredProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://personal-proveedor.onrender.com/api/proyecto/1');
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
    const filtered = proyectos.filter(p =>
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProyectos(filtered);
  }, [searchTerm, proyectos]);

  const handleAdd = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleDelete = async (item: any) => {
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      try {
        const res = await fetch(`https://personal-proveedor.onrender.com/api/proyecto/1/${item.cod_pyto}`, {
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

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingItem(null);
    fetchProyectos();
  };

  return (
    <main className="min-h-screen bg-background p-8">
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
            />
          </CardContent>
        </Card>

        <ProyectoDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          editingItem={editingItem}
          onSuccess={handleDialogClose}
        />
      </div>
    </main>
  );
}
