import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Download,
  TrendingUp,
  AlertCircle,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// Dados de exemplo para demonstração
const mockEvaData = [
  { date: "01/01", eva: 8, paciente: "João Silva" },
  { date: "08/01", eva: 7, paciente: "João Silva" },
  { date: "15/01", eva: 6, paciente: "João Silva" },
  { date: "22/01", eva: 5, paciente: "João Silva" },
  { date: "29/01", eva: 4, paciente: "João Silva" },
  { date: "05/02", eva: 3, paciente: "João Silva" },
];

const mockForceData = [
  { movimento: "Flexão Ombro D", inicial: 3, atual: 4.5, deficit: "-25%" },
  { movimento: "Flexão Ombro E", inicial: 2.5, atual: 4, deficit: "-37%" },
  { movimento: "Extensão Joelho D", inicial: 3.5, atual: 5, deficit: "-30%" },
  { movimento: "Extensão Joelho E", inicial: 3, atual: 4.5, deficit: "-33%" },
];

const mockADMData = [
  { movimento: "Flexão Ombro D", inicial: 120, atual: 160, target: 180 },
  { movimento: "Flexão Ombro E", inicial: 100, atual: 150, target: 180 },
  { movimento: "Extensão Joelho D", inicial: 110, atual: 145, target: 180 },
  { movimento: "Extensão Joelho E", inicial: 100, atual: 140, target: 180 },
];

const mockRadarData = [
  { categoria: "Força", A: 65, B: 75 },
  { categoria: "ADM", A: 60, B: 75 },
  { categoria: "Dor", A: 70, B: 45 },
  { categoria: "Funcionalidade", A: 55, B: 80 },
  { categoria: "Qualidade de Vida", A: 50, B: 75 },
];

export default function Reports() {
  const [selectedPatient, setSelectedPatient] = useState("João Silva");
  const [dateRange, setDateRange] = useState("30days");

  const patients = [
    { id: 1, name: "João Silva", lastEval: "05/02/2026" },
    { id: 2, name: "Maria Santos", lastEval: "04/02/2026" },
    { id: 3, name: "Carlos Oliveira", lastEval: "03/02/2026" },
  ];

  const handleExportPDF = () => {
    alert("Exportando relatório em PDF...");
  };

  const handleExportCSV = () => {
    alert("Exportando dados em CSV...");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Relatórios de Evolução</h1>
          <p className="text-slate-600">
            Acompanhe o progresso dos seus pacientes com gráficos e análises detalhadas
          </p>
        </div>

        {/* Filtros */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Paciente
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="90days">Últimos 90 dias</option>
              <option value="all">Todo período</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={handleExportPDF}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {/* Paciente Info */}
        <Card className="p-6 mb-8 bg-white border-l-4 border-l-emerald-600">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm">Paciente</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{selectedPatient}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Última Avaliação</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">05/02/2026</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Progresso Geral</span>
              </div>
              <p className="text-lg font-semibold text-emerald-600">+45% de melhora</p>
            </div>
          </div>
        </Card>

        {/* EVA Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Evolução da Dor (EVA)</h2>
          <p className="text-slate-600 mb-6">
            Escala Visual Analógica de Dor — Redução de 8 para 3 pontos
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockEvaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="eva"
                stroke="#059669"
                strokeWidth={2}
                dot={{ fill: "#059669", r: 5 }}
                activeDot={{ r: 7 }}
                name="EVA (Dor)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Força Muscular */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Evolução de Força Muscular</h2>
          <p className="text-slate-600 mb-6">
            Ganho de força em todos os movimentos avaliados
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockForceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="movimento" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inicial" fill="#cbd5e1" name="Inicial" />
              <Bar dataKey="atual" fill="#059669" name="Atual" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* ADM Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Evolução de ADM (Amplitude de Movimento)</h2>
          <p className="text-slate-600 mb-6">
            Ganho progressivo em amplitude articular
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockADMData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="movimento" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="inicial"
                stroke="#cbd5e1"
                name="Inicial (°)"
              />
              <Line
                type="monotone"
                dataKey="atual"
                stroke="#059669"
                name="Atual (°)"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#3b82f6"
                strokeDasharray="5 5"
                name="Meta (°)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart - Comparação */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Comparação Multidimensional</h2>
          <p className="text-slate-600 mb-6">
            Avaliação inicial vs. Avaliação atual
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={mockRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="categoria" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Inicial"
                dataKey="A"
                stroke="#cbd5e1"
                fill="#cbd5e1"
                fillOpacity={0.6}
              />
              <Radar
                name="Atual"
                dataKey="B"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Tabela de Detalhes */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Detalhes de Força Muscular</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Movimento</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Inicial</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Atual</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Ganho</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Classificação CIF</th>
                </tr>
              </thead>
              <tbody>
                {mockForceData.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">{row.movimento}</td>
                    <td className="text-center py-3 px-4">{row.inicial}/5</td>
                    <td className="text-center py-3 px-4 font-semibold text-emerald-600">{row.atual}/5</td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {row.deficit}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        XXX.1 Leve
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recomendações */}
        <Alert className="border-emerald-200 bg-emerald-50">
          <AlertCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            <strong>Recomendações:</strong> Paciente apresenta excelente progresso. Manter frequência de 2x/semana e considerar aumento de intensidade nos exercícios de força.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
