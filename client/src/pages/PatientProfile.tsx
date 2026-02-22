import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Edit,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useLocation } from "wouter";

// Dados de exemplo
const mockPatient = {
  id: 1,
  nome: "João Silva",
  email: "joao@email.com",
  telefone: "(11) 99999-0001",
  endereco: "Rua das Flores, 123 - São Paulo, SP",
  dataNascimento: "15/05/1985",
  cpf: "123.456.789-00",
  profissao: "Engenheiro",
  diagnostico: "Tendinite do ombro direito",
  medico: "Dr. Carlos Mendes",
  plano: "Particular",
  ativo: true,
};

const mockFichas = [
  {
    id: 1,
    data: "05/02/2026",
    tipo: "Avaliação Inicial",
    fisioterapeuta: "Dra. Ana Silva",
    status: "Completa",
    eva: 8,
    observacoes: "Paciente com dor intensa ao movimento",
  },
  {
    id: 2,
    data: "12/02/2026",
    tipo: "Reavaliação",
    fisioterapeuta: "Dra. Ana Silva",
    status: "Completa",
    eva: 6,
    observacoes: "Melhora significativa com tratamento",
  },
  {
    id: 3,
    data: "19/02/2026",
    tipo: "Reavaliação",
    fisioterapeuta: "Dra. Ana Silva",
    status: "Completa",
    eva: 4,
    observacoes: "Continuando com exercícios de fortalecimento",
  },
];

const mockMedicoes = [
  { data: "05/02/2026", eva: 8, forca: 2.5, adm: 90 },
  { data: "12/02/2026", eva: 6, forca: 3.5, adm: 120 },
  { data: "19/02/2026", eva: 4, forca: 4.5, adm: 150 },
];

export default function PatientProfile() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation("/dashboard")}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{mockPatient.nome}</h1>
                <p className="text-slate-600 mt-1">Perfil do Paciente</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Salvar" : "Editar"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Informações Pessoais */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Informações Pessoais</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nome Completo
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{mockPatient.nome}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                CPF
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{mockPatient.cpf}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <Mail className="w-4 h-4 text-slate-600" />
                <span className="text-slate-900">{mockPatient.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Telefone
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-4 h-4 text-slate-600" />
                <span className="text-slate-900">{mockPatient.telefone}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Data de Nascimento
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-600" />
                <span className="text-slate-900">{mockPatient.dataNascimento}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Profissão
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{mockPatient.profissao}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Endereço
              </label>
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                <MapPin className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                <span className="text-slate-900">{mockPatient.endereco}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Informações Clínicas */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Informações Clínicas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Diagnóstico
              </label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{mockPatient.diagnostico}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Médico Solicitante
              </label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{mockPatient.medico}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Plano de Saúde
              </label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{mockPatient.plano}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    mockPatient.ativo
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {mockPatient.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Histórico de Fichas */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Histórico de Fichas</h2>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nova Ficha
            </Button>
          </div>
          <div className="space-y-4">
            {mockFichas.map((ficha) => (
              <div
                key={ficha.id}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-semibold text-slate-900">{ficha.tipo}</h3>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-semibold">
                        {ficha.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {ficha.data} • {ficha.fisioterapeuta}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">EVA {ficha.eva}</div>
                    <p className="text-xs text-slate-600">Dor</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">{ficha.observacoes}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Ficha
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Evolução de Medições */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Evolução de Medições</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Data</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">EVA (Dor)</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Força (0-5)</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">ADM (°)</th>
                </tr>
              </thead>
              <tbody>
                {mockMedicoes.map((med, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{med.data}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                        {med.eva}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                        {med.forca}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
                        {med.adm}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
