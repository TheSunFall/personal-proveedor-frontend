'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API_ENDPOINTS } from '@/lib/config';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    projects: 0,
    personnel: 0,
    providers: 0,
    activeProjects: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, personalRes, providersRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.PROYECTO}`),
          fetch(`${API_ENDPOINTS.EMPLEADO}`),
          fetch(`${API_ENDPOINTS.PROVEEDOR}`)
        ]);

        const projects = projectsRes.ok ? await projectsRes.json() : [];
        const personal = personalRes.ok ? await personalRes.json() : [];
        const providers = providersRes.ok ? await providersRes.json() : [];

        setStats({
          projects: projects.length || 0,
          personnel: personal.length || 0,
          providers: providers.length || 0,
          activeProjects: projects.filter((p: any) => p.estado !== 'COMPLETADO').length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const projectData = [
    { name: 'Enero', proyectos: 2 },
    { name: 'Febrero', proyectos: 3 },
    { name: 'Marzo', proyectos: 4 },
    { name: 'Abril', proyectos: 3 }
  ];

  const budgetData = [
    { name: 'Completados', value: 35, fill: '#10b981' },
    { name: 'En Progreso', value: 45, fill: '#f59e0b' },
    { name: 'Pendientes', value: 20, fill: '#ef4444' }
  ];

  return (
    <main className="h-full w-full min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/personal')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.personnel}</div>
              <p className="text-xs text-muted-foreground mt-2">Empleados registrados</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/proveedores')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Proveedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.providers}</div>
              <p className="text-xs text-muted-foreground mt-2">Proveedores activos</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/proyectos')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Proyectos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.projects}</div>
              <p className="text-xs text-muted-foreground mt-2">En el sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs mt-2">En ejecución</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos por Mes</CardTitle>
              <CardDescription>Registrados en los últimos 4 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="proyectos" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Proyectos</CardTitle>
              <CardDescription>Distribución por estado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
