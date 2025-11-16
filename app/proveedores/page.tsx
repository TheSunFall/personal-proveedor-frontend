'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { ProveedorDialog } from '@/components/dialogs/proveedor-dialog';
import { ProveedorTable } from '@/components/tables/proveedor-table';
import { API_ENDPOINTS } from '@/lib/config';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [filteredProveedores, setFilteredProveedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ENDPOINTS.PROVEEDOR}/completos`);
      if (res.ok) {
        const data = await res.json();
        setProveedores(data);
        setFilteredProveedores(data);
      }
    } catch (error) {
      console.error('Error fetching proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = proveedores.filter(p => p.persona?.desPersona.toLowerCase().includes(searchTerm.toLowerCase()) || p.nroRuc.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredProveedores(filtered);
    } else {
      setFilteredProveedores(proveedores);
    }
  }, [searchTerm, proveedores]);

  const handleAdd = () => {
    setEditingItem(null);
    setOpenDialog(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleDelete = async (item: any) => {
    if (confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      try {
        const res = await fetch(`${API_ENDPOINTS.PROVEEDOR}/1/${item.cod_persona}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchProveedores();
        }
      } catch (error) {
        console.error('Error deleting proveedor:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingItem(null);
    fetchProveedores();
  };

  return (
    <main className="h-full w-full min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Proveedores</h1>
            <p className="text-muted-foreground mt-2">Gestión de proveedores</p>
          </div>
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus size={20} />
            Agregar Proveedor
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Buscar por nombre o razón social..."
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
            <CardTitle>Lista de Proveedores</CardTitle>
            <CardDescription>{filteredProveedores.length} proveedores registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <ProveedorTable
              data={filteredProveedores}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <ProveedorDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          editingItem={editingItem}
          onSuccess={handleDialogClose}
        />
      </div>
    </main>
  );
}
