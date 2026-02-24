import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Printer, AlertCircle, Loader2 } from "lucide-react";
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

type AreaFicha = "ortopedia" | "neuro" | "cardiorrespiratoria";

interface TestCatalogItem {
  nome: string;
  avalia: string;
  tipoResultado: string;
  registroSugerido: string;
}

interface TestResultRow extends TestCatalogItem {
  resultado: string;
  observacao: string;
}

const ORTOPEDIA_POR_ARTICULACAO: Record<string, TestCatalogItem[]> = {
  ombro: [
    { nome: "Neer", avalia: "Impacto subacromial", tipoResultado: "Positivo/Negativo", registroSugerido: "resultado + EVA" },
    { nome: "Hawkins-Kennedy", avalia: "Síndrome do impacto", tipoResultado: "Positivo/Negativo", registroSugerido: "resultado + dor" },
    { nome: "Jobe (Empty Can)", avalia: "Supraespinhal", tipoResultado: "Dor/Fraqueza/Ambos", registroSugerido: "categoria + observação" },
    { nome: "Apprehension", avalia: "Instabilidade anterior", tipoResultado: "Sim/Não", registroSugerido: "sensação de luxação" },
  ],
  joelho: [
    { nome: "Lachman", avalia: "Integridade do LCA", tipoResultado: "Grau 1/2/3 + fim de curso", registroSugerido: "grau + duro/macio" },
    { nome: "Gaveta Anterior", avalia: "Translação anterior da tíbia", tipoResultado: "Deslocamento em mm", registroSugerido: "mm + lado" },
    { nome: "McMurray", avalia: "Lesão meniscal", tipoResultado: "Estalido/Dor/Negativo", registroSugerido: "categoria + compartimento" },
    { nome: "Apley", avalia: "Lesão meniscal", tipoResultado: "Positivo/Negativo", registroSugerido: "compressão dolorosa" },
  ],
  "coluna-lombar": [
    { nome: "Lasègue (SLR)", avalia: "Compressão radicular", tipoResultado: "Ângulo em graus", registroSugerido: "grau da dor" },
    { nome: "Slump", avalia: "Tensão neural", tipoResultado: "Positivo/Negativo", registroSugerido: "resultado + lado" },
    { nome: "Schober", avalia: "Mobilidade lombar", tipoResultado: "Diferença em cm", registroSugerido: "valor em cm" },
    { nome: "FABER", avalia: "Sacroilíaca/quadril", tipoResultado: "Local da dor", registroSugerido: "região dolorosa" },
  ],
};

const TESTES_NEURO: TestCatalogItem[] = [
  { nome: "Escala de Berg", avalia: "Equilíbrio funcional", tipoResultado: "0-56", registroSugerido: "escore + risco de queda" },
  { nome: "Ashworth Modificada", avalia: "Espasticidade", tipoResultado: "0/1/1+/2/3/4", registroSugerido: "grau por segmento" },
  { nome: "Tinetti", avalia: "Marcha e equilíbrio", tipoResultado: "0-28", registroSugerido: "escore total" },
  { nome: "Fugl-Meyer", avalia: "Recuperação pós-AVC", tipoResultado: "Por domínio", registroSugerido: "membro superior/inferior" },
  { nome: "MRC", avalia: "Força muscular", tipoResultado: "0-5", registroSugerido: "grau por grupo muscular" },
  { nome: "Romberg", avalia: "Equilíbrio estático", tipoResultado: "Positivo/Negativo", registroSugerido: "resultado + tempo" },
];

const TESTES_CARDIO: TestCatalogItem[] = [
  { nome: "TC6", avalia: "Capacidade funcional submáxima", tipoResultado: "Distância + sinais vitais", registroSugerido: "metros + SpO2/FC/Borg" },
  { nome: "Shuttle Test", avalia: "Capacidade cardiorrespiratória", tipoResultado: "Estágio alcançado", registroSugerido: "nível + sintomas" },
  { nome: "Escala de Borg", avalia: "Percepção de esforço", tipoResultado: "0-10 ou 6-20", registroSugerido: "escore inicial/final" },
  { nome: "Pico de Fluxo", avalia: "Fluxo expiratório", tipoResultado: "L/min", registroSugerido: "valor absoluto" },
  { nome: "Manovacuometria", avalia: "Força muscular respiratória", tipoResultado: "PImax/PEmax", registroSugerido: "cmH2O" },
  { nome: "Cirtometria", avalia: "Expansibilidade torácica", tipoResultado: "Diferença em cm", registroSugerido: "axilar/xifoide/basal" },
];

function buildRows(items: TestCatalogItem[]): TestResultRow[] {
  return items.map((item) => ({ ...item, resultado: "", observacao: "" }));
}

export default function Ficha() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isSaving, setIsSaving] = useState(false);
  const [musculos] = useState<MuscleRow[]>([{ id: "1", articulacao: "", adm: "", forca: "", deficit: "" }]);
  const [prescricoes] = useState<PrescricaoRow[]>([{ id: "1", descricao: "", frequencia: "", quantidade: "", objetivo: "", progressao: "", observacao: "" }]);
  const [evolucoes] = useState<EvolucaoRow[]>([{ id: "1", data: "", resposta: "", ajuste: "" }]);
  const [imcClass, setImcClass] = useState<{ texto: string; cor: string } | null>(null);

  const [areaFicha, setAreaFicha] = useState<AreaFicha>("ortopedia");
  const [articulacaoOrtopedica, setArticulacaoOrtopedica] = useState<string>("ombro");
  const [testesOrtopedia, setTestesOrtopedia] = useState<TestResultRow[]>(buildRows(ORTOPEDIA_POR_ARTICULACAO.ombro));
  const [testesNeuro, setTestesNeuro] = useState<TestResultRow[]>(buildRows(TESTES_NEURO));
  const [testesCardio, setTestesCardio] = useState<TestResultRow[]>(buildRows(TESTES_CARDIO));

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

  useEffect(() => {
    if (form.dataNascimento) {
      const nasc = new Date(form.dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nasc.getFullYear();
      if (hoje < new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate())) idade--;
      setField("idadeAtual", String(idade));

      const fcMax = Math.round(208 - 0.7 * idade);
      setField("fcMax", String(fcMax));
      setField("zonaTreino", `${Math.round(fcMax * 0.6)}-${Math.round(fcMax * 0.8)}`);
      setField("frMax", String(Math.max(20, Math.round(40 - idade * 0.1))));
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

  useEffect(() => {
    setTestesOrtopedia(buildRows(ORTOPEDIA_POR_ARTICULACAO[articulacaoOrtopedica] || []));
  }, [articulacaoOrtopedica]);

  useEffect(() => {
    const testesPayload = {
      areaFicha,
      ortopedia: { articulacao: articulacaoOrtopedica, itens: testesOrtopedia },
      neuro: { itens: testesNeuro },
      cardiorrespiratoria: { itens: testesCardio },
    };
    setField("testesEspeciais", JSON.stringify(testesPayload));
  }, [areaFicha, articulacaoOrtopedica, testesOrtopedia, testesNeuro, testesCardio]);

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
    { id: "avaliacao", label: "Avaliação Específica" },
    { id: "adm", label: "ADM/Força" },
    { id: "prescricoes", label: "Prescrições" },
    { id: "estrategias", label: "Estratégias" },
    { id: "evolucao", label: "Evolução" },
    { id: "termo", label: "Termo" },
  ];

  const renderTestRows = (
    rows: TestResultRow[],
    onChange: (index: number, field: "resultado" | "observacao", value: string) => void,
  ) => rows.map((teste, index) => (
    <div key={`${teste.nome}-${index}`} className="border rounded-lg p-4 bg-slate-50/70">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="font-semibold text-slate-900">{teste.nome}</h4>
        <Badge variant="outline">{teste.tipoResultado}</Badge>
      </div>
      <p className="text-xs text-slate-600 mb-1"><strong>Avalia:</strong> {teste.avalia}</p>
      <p className="text-xs text-slate-600 mb-3"><strong>Registro:</strong> {teste.registroSugerido}</p>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <Label>Resultado</Label>
          <Input
            className="mt-1"
            placeholder="Ex: Positivo, Grau 2, 320m, 42 pontos"
            value={teste.resultado}
            onChange={(e) => onChange(index, "resultado", e.target.value)}
          />
        </div>
        <div>
          <Label>Observação clínica</Label>
          <Input
            className="mt-1"
            placeholder="Ex: Dor em rotação interna"
            value={teste.observacao}
            onChange={(e) => onChange(index, "observacao", e.target.value)}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-slate-50">
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
                <span className="text-sm text-slate-500">FC máx: {form.fcMax} | Zona de treino: {form.zonaTreino}</span>
              </div>
            )}
          </Card>
        )}

        {activeTab === "avaliacao" && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold">Avaliação Específica por Área</h2>
              <p className="text-sm text-slate-600 mt-1">Ficha diferenciada em 3 trilhas: Ortopedia, Neurológica e Cardiorrespiratória.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo da Ficha</Label>
                <Select value={areaFicha} onValueChange={(v: AreaFicha) => setAreaFicha(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ortopedia">Ortopedia</SelectItem>
                    <SelectItem value="neuro">Neurológica</SelectItem>
                    <SelectItem value="cardiorrespiratoria">Cardiorrespiratória</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Diagnóstico Clínico</Label>
                <Input className="mt-1" value={form.diagnosticoClinico} onChange={(e) => setField("diagnosticoClinico", e.target.value)} placeholder="Ex: Lesão de LCA pós-operatório" />
              </div>
            </div>

            {areaFicha === "ortopedia" && (
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-800">Ficha Ortopédica</Badge>
                <div>
                  <Label>Articulação / Região</Label>
                  <Select value={articulacaoOrtopedica} onValueChange={setArticulacaoOrtopedica}>
                    <SelectTrigger className="mt-1 max-w-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ombro">Ombro</SelectItem>
                      <SelectItem value="joelho">Joelho</SelectItem>
                      <SelectItem value="coluna-lombar">Coluna lombar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {renderTestRows(testesOrtopedia, (index, field, value) => {
                  setTestesOrtopedia((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
                })}
              </div>
            )}

            {areaFicha === "neuro" && (
              <div className="space-y-4">
                <Badge className="bg-indigo-100 text-indigo-800">Ficha Neurológica</Badge>
                {renderTestRows(testesNeuro, (index, field, value) => {
                  setTestesNeuro((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
                })}
              </div>
            )}

            {areaFicha === "cardiorrespiratoria" && (
              <div className="space-y-4">
                <Badge className="bg-rose-100 text-rose-800">Ficha Cardiorrespiratória</Badge>
                {renderTestRows(testesCardio, (index, field, value) => {
                  setTestesCardio((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
                })}
              </div>
            )}

            <div>
              <Label>Resumo clínico da avaliação específica</Label>
              <Textarea
                className="mt-1"
                rows={4}
                value={form.inspecao}
                onChange={(e) => setField("inspecao", e.target.value)}
                placeholder="Registre interpretação, red flags, evolução e conduta inicial."
              />
            </div>
          </Card>
        )}

        {activeTab !== "identificacao" && activeTab !== "sinais" && activeTab !== "avaliacao" && (
          <Card className="p-6">
            <p className="text-slate-600">Conteúdo da aba "{tabs.find(t => t.id === activeTab)?.label}" em desenvolvimento...</p>
          </Card>
        )}
      </main>
    </div>
  );
}
