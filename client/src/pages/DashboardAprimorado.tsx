import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Heart,
} from "lucide-react";

// Dados de exemplo
const mockDashboardStats = {
  totalFichas: 127,
  pacientesAtivos: 23,
  fichasEssesMes: 18,
  taxaConclusao: 92,
};

const mockPacientes = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-0001",
    ultimaAvaliacao: "05/02/2026",
    status: "ativo",
    fichas: 5,
    progresso: 75,
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria@email.com",
    telefone: "(11) 99999-0002",
    ultimaAvaliacao: "04/02/2026",
    status: "ativo",
    fichas: 3,
    progresso: 60,
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    email: "carlos@email.com",
    telefone: "(11) 99999-0003",
    ultimaAvaliacao: "03/02/2026",
    status: "ativo",
    fichas: 7,
    progresso: 85,
  },
  {
    id: 4,
    nome: "Ana Costa",
    email: "ana@email.com",
    telefone: "(11) 99999-0004",
    ultimaAvaliacao: "01/02/2026",
    status: "inativo",
    fichas: 2,
    progresso: 40,
  },
  {
    id: 5,
    nome: "Pedro Mendes",
    email: "pedro@email.com",
    telefone: "(11) 99999-0005",
    ultimaAvaliacao: "02/02/2026",
    status: "ativo",
    fichas: 4,
    progresso: 70,
  },
];

const mockFichasRecentes = [
  {
    id: 1,
    paciente: "João Silva",
    data: "05/02/2026",
    tipo: "Avaliação Inicial",
    status: "Completa",
    tempo: "12 min",
  },
  {
    id: 2,
    paciente: "Maria Santos",
    data: "04/02/2026",
    tipo: "Reavaliação",
    status: "Completa",
    tempo: "8 min",
  },
  {
    id: 3,
    paciente: "Carlos Oliveira",
    data: "03/02/2026",
    tipo: "Avaliação Inicial",
    status: "Completa",
    tempo: "15 min",
  },
  {
    id: 4,
    paciente: "Ana Costa",
    data: "01/02/2026",
    tipo: "Reavaliação",
    status: "Rascunho",
    tempo: "5 min",
  },
];

export default function DashboardAprimorado() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredPacientes = mockPacientes.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "todos" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Bem-vindo de volta!</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nova Ficha
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-semibold">Total de Fichas</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {mockDashboardStats.totalFichas}
                </p>
              </div>
              <FileText className="w-12 h-12 text-emerald-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Pacientes Ativos</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {mockDashboardStats.pacientesAtivos}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold">Este Mês</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {mockDashboardStats.fichasEssesMes}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold">Taxa de Conclusão</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {mockDashboardStats.taxaConclusao}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Fichas Recentes */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Fichas Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Paciente</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Tipo</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Tempo</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockFichasRecentes.map((ficha) => (
                  <tr key={ficha.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{ficha.paciente}</td>
                    <td className="py-3 px-4 text-slate-600">{ficha.data}</td>
                    <td className="py-3 px-4 text-slate-600">{ficha.tipo}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ficha.status === "Completa"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ficha.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">{ficha.tempo}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Gestão de Pacientes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Meus Pacientes</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
              </select>
            </div>
          </div>

          {/* Grid View */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacientes.map((paciente) => (
              <Card
                key={paciente.id}
                className="p-6 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{paciente.nome}</h3>
                    <p className="text-sm text-slate-600 mt-1">{paciente.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      paciente.status === "ativo"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {paciente.status === "ativo" ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <span>{paciente.fichas} fichas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Última: {paciente.ultimaAvaliacao}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span>Progresso: {paciente.progresso}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${paciente.progresso}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredPacientes.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">Nenhum paciente encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
