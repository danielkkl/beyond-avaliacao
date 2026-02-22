/* ============================================================
   Beyond Avaliação — Ficha de Avaliação Fisioterapêutica
   Design: Medical Precision + Clinical Modernism
   Referências Científicas: CIF, EVA, IMC, Classificação de Força
   ============================================================ */

import { useRef, useState, useEffect } from "react";
import MapaDor from "@/components/MapaDor";
import AssinaturaCanvas from "@/components/AssinaturaCanvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, Save, ChevronDown } from "lucide-react";

interface FichaData {
  // Identificação
  nomePaciente: string;
  dataNascimento: string;
  sexo: string;
  estadoCivil: string;
  perfilEtnico: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  profissao: string;
  planoSaude: string;
  diagnosticoClinico: string;
  medico: string;
  numeroProntuario: string;
  dataAvaliacao: string;
  consultor: string;

  // Hábitos
  alimentacao: string;
  sono: string;
  hidratacao: string;
  rotinaDiaria: string;
  atividadeFisica: string;
  medicamentos: string;
  tabagismo: string;
  etilismo: string;
  estresse: string;
  trabalhoRepetitivo: string;
  trabalhoRepetitivoQual: string;
  historicoEsportivo: string;
  historicoEsportivoQual: string;

  // Sinais Vitais
  pa: string;
  fc: string;
  fr: string;
  sato2: string;
  temperatura: string;
  glicemia: string;
  peso: string;
  altura: string;

  // Anamnese
  hda: string;
  hdp: string;
  eva: number;
  inicioDor: string;
  tipoDor: string;
  irradiacao: string;
  fatoresMelhora: string;
  fatoresPiora: string;
  cirurgias: string;

  // Exame Físico
  inspecao: string;
  palpacao: string;
  posturaEstatica: string;
  posturaDinamica: string;
  marcha: string;
  perimetria: string;
  testesEspeciais: string;

  // ADM/Força
  admLinhas: Array<{
    id: string;
    movimento: string;
    admDireita: string;
    admEsquerda: string;
    forcaDireita: string;
    forcaEsquerda: string;
  }>;

  // Prescrições
  prescricoes: Array<{
    id: string;
    descricao: string;
    objetivo: string;
    frequencia: string;
    quantidade: string;
    progressao: string;
    observacao: string;
  }>;

  // Estratégias
  estrategiaCurto: string;
  estrategiaMedio: string;
  estrategiaLongo: string;

  // Evolução
  evolucoes: Array<{
    id: string;
    data: string;
    fisio: string;
    descricao: string;
    resposta: string;
    ajuste: string;
  }>;

  // Consentimento
  consentFotos: boolean;
  consentFaltas: boolean;
  consentReposicao: boolean;
}

const SECTIONS = [
  { num: 1, id: "identificacao", label: "Identificação", icon: "👤" },
  { num: 2, id: "habitos", label: "Hábitos de Vida", icon: "🏥" },
  { num: 3, id: "sinais", label: "Sinais Vitais", icon: "❤️" },
  { num: 4, id: "anamnese", label: "Anamnese", icon: "📋" },
  { num: 5, id: "exame", label: "Exame Físico", icon: "🔍" },
  { num: 6, id: "mapa", label: "Mapa da Dor", icon: "🗺️" },
  { num: 7, id: "adm", label: "ADM / Força", icon: "💪" },
  { num: 8, id: "prescricoes", label: "Prescrições", icon: "📝" },
  { num: 9, id: "estrategias", label: "Estratégias", icon: "🎯" },
  { num: 10, id: "evolucao", label: "Evolução", icon: "📊" },
  { num: 11, id: "consentimento", label: "Consentimento", icon: "✅" },
  { num: 12, id: "assinaturas", label: "Assinaturas", icon: "✍️" },
];

const EVA_COLORS = [
  "#22c55e", "#4ade80", "#86efac", "#bef264", "#fde047",
  "#fbbf24", "#fb923c", "#f97316", "#ef4444", "#dc2626", "#991b1b"
];

function SectionHeader({ num, title, icon }: { num: number; title: string; icon: string }) {
  return (
    <div className="section-header flex items-center gap-3 mb-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seção {num}</div>
        <div className="text-lg font-bold text-slate-900">{title}</div>
      </div>
    </div>
  );
}

function FieldGroup({ label, children, className = "", help = "" }: { label: string; children: React.ReactNode; className?: string; help?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      {help && <p className="text-xs text-slate-500 mb-1">{help}</p>}
      {children}
    </div>
  );
}

function CalcField({ label, value, badge, help = "" }: { label: string; value: string; badge?: string; help?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      {help && <p className="text-xs text-slate-500 mb-1">{help}</p>}
      <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 font-mono text-sm">
        {value || <span className="text-slate-400">—</span>}
        {badge && value && (
          <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
            badge.includes("normal") ? "bg-green-100 text-green-800" :
            badge.includes("leve") ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>{badge}</span>
        )}
      </div>
    </div>
  );
}

export default function FichaAvaliacao() {
  const [ficha, setFicha] = useState<FichaData>({
    nomePaciente: "", dataNascimento: "", sexo: "", estadoCivil: "", perfilEtnico: "",
    cpf: "", telefone: "", email: "", endereco: "", profissao: "", planoSaude: "",
    diagnosticoClinico: "", medico: "", numeroProntuario: "", dataAvaliacao: new Date().toISOString().split('T')[0],
    consultor: "",
    alimentacao: "", sono: "", hidratacao: "", rotinaDiaria: "", atividadeFisica: "",
    medicamentos: "", tabagismo: "", etilismo: "", estresse: "", trabalhoRepetitivo: "",
    trabalhoRepetitivoQual: "", historicoEsportivo: "", historicoEsportivoQual: "",
    pa: "", fc: "", fr: "", sato2: "", temperatura: "", glicemia: "", peso: "", altura: "",
    hda: "", hdp: "", eva: 0, inicioDor: "", tipoDor: "", irradiacao: "",
    fatoresMelhora: "", fatoresPiora: "", cirurgias: "",
    inspecao: "", palpacao: "", posturaEstatica: "", posturaDinamica: "",
    marcha: "", perimetria: "", testesEspeciais: "",
    admLinhas: [{ id: "1", movimento: "", admDireita: "", admEsquerda: "", forcaDireita: "", forcaEsquerda: "" }],
    prescricoes: [{ id: "1", descricao: "", objetivo: "", frequencia: "", quantidade: "", progressao: "", observacao: "" }],
    estrategiaCurto: "", estrategiaMedio: "", estrategiaLongo: "",
    evolucoes: [],
    consentFotos: false, consentFaltas: false, consentReposicao: false,
  });

  const [activeSection, setActiveSection] = useState("identificacao");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const update = (key: keyof FichaData, value: any) => {
    setFicha(prev => ({ ...prev, [key]: value }));
  };

  const computed = {
    idade: ficha.dataNascimento ? Math.floor((new Date().getTime() - new Date(ficha.dataNascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : "",
    imc: ficha.peso && ficha.altura ? (parseFloat(ficha.peso) / Math.pow(parseFloat(ficha.altura) / 100, 2)).toFixed(1) : "",
    imcClassificacao: ficha.peso && ficha.altura ? (() => {
      const imc = parseFloat(ficha.peso) / Math.pow(parseFloat(ficha.altura) / 100, 2);
      if (imc < 18.5) return "Baixo peso";
      if (imc < 25) return "Peso normal";
      if (imc < 30) return "Sobrepeso";
      return "Obesidade";
    })() : "",
    fcMax: ficha.dataNascimento ? (220 - Math.floor((new Date().getTime() - new Date(ficha.dataNascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))).toString() : "",
    zonaTreino: ficha.dataNascimento ? (() => {
      const idade = Math.floor((new Date().getTime() - new Date(ficha.dataNascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      const fcMax = 220 - idade;
      return `${Math.round(fcMax * 0.6)} - ${Math.round(fcMax * 0.8)} bpm`;
    })() : "",
  };

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Beyond Avaliação</h1>
              <p className="text-xs text-slate-500">Ficha de Avaliação Fisioterapêutica</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => alert("Funcionalidade em desenvolvimento")}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" />
              PDF / Imprimir
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg border border-slate-200 shadow-sm p-4 no-print">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Seções</h3>
              <nav className="space-y-2">
                {SECTIONS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === s.id
                        ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="mr-2">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Alert */}
            <Alert className="border-emerald-200 bg-emerald-50">
              <AlertCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800">
                <strong>Beyond Avaliação</strong> — Ficha profissional baseada em protocolos científicos (CIF, EVA, IMC). Todos os cálculos são automáticos.
              </AlertDescription>
            </Alert>

            {/* SEÇÃO 1: IDENTIFICAÇÃO */}
            <Card className="p-6" ref={el => { sectionRefs.current["identificacao"] = el; }} data-section-id="identificacao">
              <SectionHeader num={1} title="Identificação Completa do Paciente" icon="👤" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FieldGroup label="Nome Completo" className="lg:col-span-2">
                  <input
                    type="text"
                    value={ficha.nomePaciente}
                    onChange={e => update("nomePaciente", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nome completo"
                  />
                </FieldGroup>
                <FieldGroup label="Nº Prontuário">
                  <input
                    type="text"
                    value={ficha.numeroProntuario}
                    onChange={e => update("numeroProntuario", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="000000"
                  />
                </FieldGroup>

                <FieldGroup label="Data de Nascimento">
                  <input
                    type="date"
                    value={ficha.dataNascimento}
                    onChange={e => update("dataNascimento", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </FieldGroup>
                <CalcField label="Idade" value={computed.idade?.toString() || ""} help="Calculado automaticamente" />
                <FieldGroup label="Sexo">
                  <select
                    value={ficha.sexo}
                    onChange={e => update("sexo", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Selecione</option>
                    <option>Masculino</option>
                    <option>Feminino</option>
                    <option>Outro</option>
                  </select>
                </FieldGroup>

                <FieldGroup label="Estado Civil">
                  <select
                    value={ficha.estadoCivil}
                    onChange={e => update("estadoCivil", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Selecione</option>
                    <option>Solteiro(a)</option>
                    <option>Casado(a)</option>
                    <option>Divorciado(a)</option>
                    <option>Viúvo(a)</option>
                  </select>
                </FieldGroup>

                <FieldGroup label="CPF">
                  <input
                    type="text"
                    value={ficha.cpf}
                    onChange={e => update("cpf", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="000.000.000-00"
                  />
                </FieldGroup>

                <FieldGroup label="Telefone">
                  <input
                    type="tel"
                    value={ficha.telefone}
                    onChange={e => update("telefone", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="(00) 00000-0000"
                  />
                </FieldGroup>

                <FieldGroup label="E-mail">
                  <input
                    type="email"
                    value={ficha.email}
                    onChange={e => update("email", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="email@exemplo.com"
                  />
                </FieldGroup>

                <FieldGroup label="Endereço" className="lg:col-span-2">
                  <input
                    type="text"
                    value={ficha.endereco}
                    onChange={e => update("endereco", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Rua, número, bairro, cidade"
                  />
                </FieldGroup>

                <FieldGroup label="Profissão">
                  <input
                    type="text"
                    value={ficha.profissao}
                    onChange={e => update("profissao", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </FieldGroup>

                <FieldGroup label="Diagnóstico Clínico" className="lg:col-span-2">
                  <input
                    type="text"
                    value={ficha.diagnosticoClinico}
                    onChange={e => update("diagnosticoClinico", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="CID / diagnóstico"
                  />
                </FieldGroup>

                <FieldGroup label="Médico Solicitante">
                  <input
                    type="text"
                    value={ficha.medico}
                    onChange={e => update("medico", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </FieldGroup>

                <FieldGroup label="Data da Avaliação">
                  <input
                    type="date"
                    value={ficha.dataAvaliacao}
                    onChange={e => update("dataAvaliacao", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </FieldGroup>

                <FieldGroup label="Consultor">
                  <input
                    type="text"
                    value={ficha.consultor}
                    onChange={e => update("consultor", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Nome — CREFITO"
                  />
                </FieldGroup>
              </div>
            </Card>

            {/* SEÇÃO 3: SINAIS VITAIS (com cálculos) */}
            <Card className="p-6" ref={el => { sectionRefs.current["sinais"] = el; }} data-section-id="sinais">
              <SectionHeader num={3} title="Sinais Vitais e Antropometria" icon="❤️" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FieldGroup label="PA (mmHg)" help="Pressão Arterial">
                  <input type="text" value={ficha.pa} onChange={e => update("pa", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="120/80" />
                </FieldGroup>
                <FieldGroup label="FC (bpm)" help="Frequência Cardíaca">
                  <input type="number" value={ficha.fc} onChange={e => update("fc", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="72" />
                </FieldGroup>
                <FieldGroup label="FR (irpm)" help="Frequência Respiratória">
                  <input type="number" value={ficha.fr} onChange={e => update("fr", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="16" />
                </FieldGroup>
                <FieldGroup label="SatO₂ (%)" help="Saturação de Oxigênio">
                  <input type="number" value={ficha.sato2} onChange={e => update("sato2", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="98" />
                </FieldGroup>
                <FieldGroup label="Temperatura (°C)">
                  <input type="number" step="0.1" value={ficha.temperatura} onChange={e => update("temperatura", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="36.5" />
                </FieldGroup>
                <FieldGroup label="Glicemia (mg/dL)">
                  <input type="number" value={ficha.glicemia} onChange={e => update("glicemia", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="90" />
                </FieldGroup>

                <FieldGroup label="Peso (kg)">
                  <input type="number" step="0.1" value={ficha.peso} onChange={e => update("peso", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="70" />
                </FieldGroup>
                <FieldGroup label="Altura (cm)">
                  <input type="number" value={ficha.altura} onChange={e => update("altura", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="170" />
                </FieldGroup>

                <CalcField label="IMC (kg/m²)" value={computed.imc?.toString() || ""} badge={computed.imcClassificacao} help="Índice de Massa Corporal (WHO)" />
                <CalcField label="Classificação IMC" value={computed.imcClassificacao} />
                <CalcField label="FC Máx (bpm)" value={computed.fcMax ? `${computed.fcMax} bpm` : ""} help="220 - idade" />
                <CalcField label="Zona de Treino 60–80%" value={computed.zonaTreino} help="Frequência cardíaca alvo" />
              </div>
            </Card>

            {/* SEÇÃO 4: ANAMNESE */}
            <Card className="p-6" ref={el => { sectionRefs.current["anamnese"] = el; }} data-section-id="anamnese">
              <SectionHeader num={4} title="Anamnese Completa" icon="📋" />
              <div className="space-y-4">
                <FieldGroup label="HDA — História da Doença Atual">
                  <textarea rows={3} value={ficha.hda} onChange={e => update("hda", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Descreva a história da doença atual..." />
                </FieldGroup>
                <FieldGroup label="HDP — História da Doença Pregressa">
                  <textarea rows={3} value={ficha.hdp} onChange={e => update("hdp", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Histórico de doenças anteriores..." />
                </FieldGroup>

                {/* EVA */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">EVA — Escala Visual Analógica de Dor</label>
                  <p className="text-xs text-slate-500 mb-2">Referência: Huskisson EC. Measurement of pain. Lancet. 1974</p>
                  <div className="flex gap-1">
                    {Array.from({ length: 11 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => update("eva", i)}
                        className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                          ficha.eva === i ? "ring-2 ring-offset-2 ring-emerald-500 scale-110" : ""
                        }`}
                        style={{ background: EVA_COLORS[i] }}
                        title={`${i}`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>0 = Sem dor</span>
                    <span className="font-bold" style={{ color: EVA_COLORS[ficha.eva] }}>Selecionado: {ficha.eva}</span>
                    <span>10 = Dor máxima</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldGroup label="Início da Dor">
                    <input type="text" value={ficha.inicioDor} onChange={e => update("inicioDor", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Ex: há 3 meses" />
                  </FieldGroup>
                  <FieldGroup label="Tipo de Dor">
                    <select value={ficha.tipoDor} onChange={e => update("tipoDor", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                      <option value="">Selecione</option>
                      <option>Pontada</option>
                      <option>Queimação</option>
                      <option>Pressão</option>
                      <option>Latejamento</option>
                      <option>Formigamento</option>
                      <option>Choque</option>
                      <option>Difusa</option>
                    </select>
                  </FieldGroup>
                  <FieldGroup label="Irradiação">
                    <input type="text" value={ficha.irradiacao} onChange={e => update("irradiacao", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Para onde irradia?" />
                  </FieldGroup>
                  <FieldGroup label="Fatores de Melhora">
                    <input type="text" value={ficha.fatoresMelhora} onChange={e => update("fatoresMelhora", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="O que melhora a dor?" />
                  </FieldGroup>
                  <FieldGroup label="Fatores de Piora">
                    <input type="text" value={ficha.fatoresPiora} onChange={e => update("fatoresPiora", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="O que piora a dor?" />
                  </FieldGroup>
                  <FieldGroup label="Cirurgias Anteriores">
                    <input type="text" value={ficha.cirurgias} onChange={e => update("cirurgias", e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Descreva cirurgias" />
                  </FieldGroup>
                </div>
              </div>
            </Card>

            {/* SEÇÃO 6: MAPA DA DOR */}
            <Card className="p-6" ref={el => { sectionRefs.current["mapa"] = el; }} data-section-id="mapa">
              <SectionHeader num={6} title="Mapa da Dor" icon="🗺️" />
              <p className="text-sm text-slate-600 mb-4">Selecione a intensidade e pinte as áreas afetadas. Referência: Classificação de Dor (0-10).</p>
              <MapaDor />
            </Card>

            {/* SEÇÃO 12: ASSINATURAS */}
            <Card className="p-6" ref={el => { sectionRefs.current["assinaturas"] = el; }} data-section-id="assinaturas">
              <SectionHeader num={12} title="Assinaturas" icon="✍️" />
              <div className="flex flex-wrap gap-8 justify-around">
                <AssinaturaCanvas label="Assinatura do Paciente" sublabel={ficha.nomePaciente || "Nome do paciente"} width={280} height={80} />
                <AssinaturaCanvas label="Assinatura do Fisioterapeuta" sublabel={ficha.consultor || "Fisioterapeuta"} width={280} height={80} />
              </div>
            </Card>

            {/* Footer */}
            <div className="text-center text-xs text-slate-500 py-8 border-t border-slate-200">
              <p>Beyond Avaliação — Ficha de Avaliação Fisioterapêutica Profissional</p>
              <p>Baseado em protocolos científicos: CIF (OMS), EVA (Huskisson), IMC (WHO), Classificação de Força Muscular</p>
              <p>Documento gerado em {new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
