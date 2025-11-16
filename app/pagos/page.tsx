'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_ENDPOINTS } from '@/lib/config';

export default function PagosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('personal');
  const [personal, setPersonal] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [personalRes, proveedoresRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.EMPLEADO}/completos`),
        fetch(`${API_ENDPOINTS.PROVEEDOR}/completos`),
      ]);

      if (personalRes.ok) {
        const data = await personalRes.json();
        setPersonal(data);
      }
      if (proveedoresRes.ok) {
        const data = await proveedoresRes.json();
        setProveedores(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPersonal = searchTerm? (personal.filter(p =>
    p.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase())
  )) : personal;

  const filteredProveedores = searchTerm? (proveedores.filter(p =>
    p.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase())
  )) : proveedores;

  return (
    <main className="h-full w-full min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Pagos</h1>
          <p className="text-muted-foreground mt-2">Gestión de pagos a personal y proveedores</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Buscar personal o proveedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal - Recibo por Honorarios</CardTitle>
                <CardDescription>Realiza pagos a empleados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {loading ? (
                    <p className="text-muted-foreground">Cargando...</p>
                  ) : filteredPersonal.length === 0 ? (
                    <p className="text-muted-foreground">No hay resultados</p>
                  ) : (
                    filteredPersonal.map((p) => (
                      <div key={p.codEmpleado} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted">
                        <div>
                          <p className="font-medium">{p.persona.desPersona}</p>
                          <p className="text-sm text-muted-foreground">{p.email}</p>
                        </div>
                        <Button size="sm">Realizar Pago</Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proveedores">
            <Card>
              <CardHeader>
                <CardTitle>Proveedores - Pagos de Servicios</CardTitle>
                <CardDescription>Realiza pagos a proveedores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {loading ? (
                    <p className="text-muted-foreground">Cargando...</p>
                  ) : filteredProveedores.length === 0 ? (
                    <p className="text-muted-foreground">No hay resultados</p>
                  ) : (
                    filteredProveedores.map((p) => (
                      <div key={p.codProveedor} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted">
                        <div>
                          <p className="font-medium">{p.persona.desPersona}</p>
                          <p className="text-sm text-muted-foreground">RUC: {p.nroRuc}</p>
                        </div>
                        <Button size="sm">Realizar Pago</Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
