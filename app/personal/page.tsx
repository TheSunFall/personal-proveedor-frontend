'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { PersonalDialog } from '@/components/dialogs/personal-dialog';
import { PersonalTable } from '@/components/tables/personal-table';
import { API_ENDPOINTS } from '@/lib/config';

export default function PersonalPage() {
  const [personal, setPersonal] = useState<any[]>([]);
  const [filteredPersonal, setFilteredPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ENDPOINTS.EMPLEADO}/completos`);
      if (res.ok) {
        const data = await res.json();
        setPersonal(data);
        setFilteredPersonal(data);
      }
    } catch (error) {
      console.error('Error fetching personal:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = personal?.filter(p => p.persona?.desPersona.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredPersonal(filtered);
    } else {
      setFilteredPersonal(personal)
    }
  }, [searchTerm, personal]);

  const handleAdd = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleDelete = async (item: any) => {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
      try {
        const res = await fetch(`${API_ENDPOINTS.EMPLEADO}/1/${item.codEmpleado}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchPersonal();
        }
      } catch (error) {
        console.error('Error deleting personal:', error);
      }
    }
  };

  const handleDialogClose = (callback: any) => {
    callback(false);
    setEditingItem(null);
    fetchPersonal();
  };

  return (
    <main className="h-full w-full min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Personal</h1>
            <p className="text-muted-foreground mt-2">Gestión de empleados</p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus size={20} />
            Agregar Personal
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Buscar por nombre, apellido, DNI..."
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
            <CardTitle>Lista de Empleados</CardTitle>
            <CardDescription>{filteredPersonal.length} empleados registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <PersonalTable
              data={filteredPersonal}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <PersonalDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          editingItem={editingItem}
          onSuccess={() => handleDialogClose}
        />
      </div>
    </main>
  );
}
