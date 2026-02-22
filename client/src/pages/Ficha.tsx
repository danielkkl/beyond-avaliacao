import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Printer, Plus, Trash2, X, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generatePDF } from "@/components/PDFGenerator";
import { trpc } from "@/lib/trpc";

interface FormData {
  nomePaciente: string;
  dataNascimento: string;
  idadeAtual: string;
  sexo: string;
  estadoCivil: string;
  perfilEtnico: string;
  profissao: string;
  diagnosticoClinico: string;
  nomeMedico: string;
  planoSaude: string;
  consultor: string;
  telefone: string;
  email: string;
  endereco: string;
  cpf: string;
  numeroProntuario: string;
  dataAvaliacao: string;
  numeroAtendimentos: string;
  alimentacao: string;
  sono: string;
  ingestaoHidrica: string;
  rotinaDiaria: string;
  atividadeFisica: string;
  medicamentos: string;
  tabagismo: string;
  etilismo: string;
  estresse: string;
  trabalhoRepetitivo: string;
  historicoEsportivo: string;
  pa: string;
  fc: string;
  fr: string;
  satO2: string;
  temperatura: string;
  peso: string;
  altura: string;
  imc: string;
  classificacaoIMC: string;
  fcMax: string;
  zonaTreino: string;
  frMax: string;
  glicemia: string;
  hda: string;
  hdp: string;
  eva: string;
  inicioDor: string;
  tipoDor: string;
  irradiacao: string;
  fatoresMelhora: string;
  fatoresPiora: string;
  cirurgias: string;
  inspecao: string;
  palpacao: string;
  sensibilidade: string;
  posturaEstatica: string;
  posturaDinamica: string;
  marcha: string;
  perimetria: string;
  testesEspeciais: string;
  estrategiasCurto: string;
  estrategiasMedio: string;
  estrategiasLongo: string;
  aceitoTermo: boolean;
}

interface MuscleRow { id: string; articulacao: string; adm: string; forca: string; deficit: string; }
interface PrescricaoRow { id: string; descricao: string; frequencia: string; quantidade: string; objetivo: string; progressao: string; observacao: string; }
interface EvolucaoRow { id: string; data: string; resposta: string; ajuste: string; }

export default function Ficha() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isSaving, setIsSaving] = useState(false);
  const [musculos, setMusculos] = useState<MuscleRow[]>([{ id: "1", articulacao: "", adm: "", forca: "", deficit: "" }]);
  const [prescricoes, setPrescricoes] = useState<PrescricaoRow[]>([{ id: "1", descricao: "", frequencia: "", quantidade: "", objetivo: "", progressao: "", observacao: "" }]);
  const [evolucoes, setEvolucoes] = useState<EvolucaoRow[]>([{ id: "1", data: "", resposta: "", ajuste: "" }]);
  const [imcClass, setImcClass] = useState<{ texto: string; cor: string } | null>(null);

  const [form, setForm] = useState<FormData>({
    nomePaciente: "", dataNascimento: "", idadeAtual: "", sexo: "Masculino",
    estadoCivil: "Solteiro(a)", perfilEtnico: "", profissao: "", diagnosticoClinico: "",
    nomeMedico: "", planoSaude: "", consultor: user?.name || "Dr. Daniel Barcellos",
    telefone: "", email: "", endereco: "", cpf: "", numeroProntuario: "", dataAvaliacao: "", numeroAtendimentos: "",
    alimentacao: "", sono: "", ingestaoHidrica: "", rotinaDiaria: "", atividadeFisica: "", medicamentos: "",
    tabagismo: "Não", etilismo: "Não", estresse: "Não", trabalhoRepetitivo: "", historicoEsportivo: "",
    pa: "", fc: "", fr: "", satO2: "", temperatura: "", peso: "", altura: "",
    imc: "", classificacaoIMC: "", fcMax: "", zonaTreino: "", frMax: "", glicemia: "",
    hda: "", hdp: "", eva: "", inicioDor: "", tipoDor: "", irradiacao: "", fatoresMelhora: "", fatoresPiora: "", cirurgias: "",
    inspecao: "", palpacao: "", sensibilidade: "", posturaEstatica: "", posturaDinamica: "", marcha: "", perimetria: "", testesEspeciais: "",
    estrategiasCurto: "", estrategiasMedio: "", estrategiasLongo: "",
    aceitoTermo: false,
  });

  const setField = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Auto-calculate age and IMC
  useEffect(() => {
    if (form.dataNascimento) {
      const nasc = new Date(form.dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nasc.getFullYear();
      if (hoje < new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate())) idade--;
      setField("idadeAtual", String(idade));
      
      const fcMax = 220 - idade;
      setField("fcMax", String(fcMax));
      setField("zonaTreino", `${Math.round(fcMax * 0.6)}-${Math.round(fcMax * 0.8)}`);
    }
  }, [form.dataNascimento]);

  useEffect(() => {
    if (form.peso && form.altura) {
      const peso = parseFloat(form.peso);
      const altura = parseFloat(form.altura);
      if (peso > 0 && altura > 0) {
        const imc = peso / (altura * altura);
        setField("imc", imc.toFixed(2));
        
        let classification = "Baixo peso";
        let color = "bg-blue-100 text-blue-800";
        if (imc >= 18.5 && imc < 25) { classification = "Eutrofia"; color = "bg-green-100 text-green-800"; }
        else if (imc >= 25 && imc < 30) { classification = "Sobrepeso"; color = "bg-yellow-100 text-yellow-800"; }
        else if (imc >= 30 && imc < 35) { classification = "Obesidade I"; color = "bg-orange-100 text-orange-800"; }
        else if (imc >= 35 && imc < 40) { classification = "Obesidade II"; color = "bg-red-100 text-red-800"; }
        else { classification = "Obesidade III"; color = "bg-red-200 text-red-900"; }
        
        setField("classificacaoIMC", classification);
        setImcClass({ texto: classification, cor: color });
      }
    }
  }, [form.peso, form.altura]);

  const createFichaMutation = trpc.fichas.create.useMutation();
  const getUsageQuery = trpc.plans.getUsage.useQuery();

  const handleSave = async () => {
    if (!form.nomePaciente) {
      toast.error("Por favor, preencha o nome do paciente");
      return;
    }

    setIsSaving(true);
    try {
      await createFichaMutation.mutateAsync({
        ...form,
        peso: form.peso ? parseFloat(form.peso) : undefined,
        altura: form.altura ? parseFloat(form.altura) : undefined,
        imc: form.imc ? parseFloat(form.imc) : undefined,
        idadeAtual: form.idadeAtual ? parseInt(form.idadeAtual) : undefined,
        eva: form.eva ? parseInt(form.eva) : undefined,
        fcMax: form.fcMax ? parseInt(form.fcMax) : undefined,
        frMax: form.frMax ? parseInt(form.frMax) : undefined,
        numeroAtendimentos: form.numeroAtendimentos ? parseInt(form.numeroAtendimentos) : undefined,
        musculos,
        prescricoes,
        evolucoes,
      });
      toast.success("Ficha salva com sucesso!");
      setLocation("/dashboard");
    } catch (error: any) {
      if (error.message.includes("Limite")) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao salvar ficha");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      await generatePDF({ form, musculos, prescricoes, evolucoes });
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
    }
  };

  const tabs = [
    { id: "identificacao", label: "Identificação" },
    { id: "habitos", label: "Hábitos" },
    { id: "sinais", label: "Sinais Vitais" },
    { id: "anamnese", label: "Anamnese" },
    { id: "avaliacao", label: "Avaliação" },
    { id: "adm", label: "ADM/Força" },
    { id: "prescricoes", label: "Prescrições" },
    { id: "estrategias", label: "Estratégias" },
    { id: "evolucao", label: "Evolução" },
    { id: "termo", label: "Termo" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ficha de Avaliação</h1>
            <p className="text-sm text-slate-600">{form.nomePaciente || "Novo paciente"}</p>
          </div>
          <div className="flex items-center gap-4">
            {getUsageQuery.data && (
              <div className="text-sm text-slate-600">
                <span>Fichas: {getUsageQuery.data.current}/{getUsageQuery.data.limit === Infinity ? "∞" : getUsageQuery.data.limit}</span>
              </div>
            )}
            <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
            <Button onClick={handleGeneratePDF} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "identificacao" && (
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-bold">Identificação do Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Nome Completo</Label>
                <Input placeholder="Nome do paciente" value={form.nomePaciente} onChange={e => setField("nomePaciente", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Data de Nascimento</Label>
                <Input type="date" value={form.dataNascimento} onChange={e => setField("dataNascimento", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Idade</Label>
                <Input readOnly value={form.idadeAtual} className="mt-1 bg-slate-50" />
              </div>
              <div>
                <Label>Sexo</Label>
                <Select value={form.sexo} onValueChange={v => setField("sexo", v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Profissão</Label>
                <Input placeholder="Profissão" value={form.profissao} onChange={e => setField("profissao", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input placeholder="(XX) XXXXX-XXXX" value={form.telefone} onChange={e => setField("telefone", e.target.value)} className="mt-1" />
              </div>
            </div>
          </Card>
        )}

        {activeTab === "sinais" && (
          <Card className="p-6 space-y-6">
            <h2 className="text-xl font-bold">Sinais Vitais</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>PA (mmHg)</Label>
                <Input placeholder="120/80" value={form.pa} onChange={e => setField("pa", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>FC (bpm)</Label>
                <Input placeholder="72" value={form.fc} onChange={e => setField("fc", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Peso (kg)</Label>
                <Input type="number" step="0.1" placeholder="70" value={form.peso} onChange={e => setField("peso", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Altura (m)</Label>
                <Input type="number" step="0.01" placeholder="1.75" value={form.altura} onChange={e => setField("altura", e.target.value)} className="mt-1" />
              </div>
            </div>
            {imcClass && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <AlertCircle className="w-5 h-5 text-slate-500" />
                <span className="text-sm">IMC: <Badge className={imcClass.cor}>{imcClass.texto}</Badge></span>
              </div>
            )}
          </Card>
        )}

        {/* Outras abas... */}
        {activeTab !== "identificacao" && activeTab !== "sinais" && (
          <Card className="p-6">
            <p className="text-slate-600">Conteúdo da aba "{tabs.find(t => t.id === activeTab)?.label}" em desenvolvimento...</p>
          </Card>
        )}
      </main>
    </div>
  );
}
