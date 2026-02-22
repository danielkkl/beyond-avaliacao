import { useState, useCallback } from "react";

export interface Prescricao {
  id: string;
  descricao: string;
  objetivo: string;
  frequencia: string;
  quantidade: string;
  progressao: string;
  observacao: string;
}

export interface Evolucao {
  id: string;
  data: string;
  fisio: string;
  descricao: string;
  resposta: string;
  ajuste: string;
}

export interface AdmLinha {
  id: string;
  movimento: string;
  adm_direita: string;
  adm_esquerda: string;
  forca_direita: string;
  forca_esquerda: string;
  deficit_pct: string;
  classificacao: string;
}

export interface FichaData {
  // 1. Identificação
  nome: string;
  data_nascimento: string;
  sexo: string;
  estado_civil: string;
  etnia: string;
  profissao: string;
  diagnostico: string;
  medico_solicitante: string;
  plano_saude: string;
  num_atendimentos: string;
  consultor: string;
  data_consulta: string;
  telefone: string;
  email: string;
  endereco: string;
  cpf: string;
  num_prontuario: string;
  data_avaliacao: string;

  // 2. Hábitos de vida
  alimentacao: string;
  sono: string;
  hidratacao: string;
  rotina_diaria: string;
  atividade_fisica: string;
  medicamentos: string;
  tabagismo: string;
  etilismo: string;
  estresse: string;
  trabalho_repetitivo: string;
  trabalho_repetitivo_qual: string;
  historico_esportivo: string;
  historico_esportivo_qual: string;

  // 3. Sinais vitais
  pa: string;
  fc: string;
  fr: string;
  sato2: string;
  temperatura: string;
  peso: string;
  altura: string;
  glicemia: string;

  // 4. Anamnese
  hda: string;
  hdp: string;
  eva: number;
  inicio_dor: string;
  tipo_dor: string;
  irradiacao: string;
  fatores_melhora: string;
  fatores_piora: string;
  cirurgias_previas: string;

  // 5. Exame físico
  inspecao: string;
  palpacao: string;
  postura_estatica: string;
  postura_dinamica: string;
  marcha: string;
  perimetria: string;
  testes_especiais: string;

  // 7. ADM / Força
  adm_linhas: AdmLinha[];

  // 8. Prescrições
  prescricoes: Prescricao[];

  // 9. Estratégias
  estrategia_curto: string;
  estrategia_medio: string;
  estrategia_longo: string;

  // 10. Evolução
  evolucoes: Evolucao[];

  // 11. Consentimento
  consent_fotos: boolean;
  consent_faltas: boolean;
  consent_reposicao: boolean;
}

const defaultFicha: FichaData = {
  nome: "",
  data_nascimento: "",
  sexo: "",
  estado_civil: "",
  etnia: "",
  profissao: "",
  diagnostico: "",
  medico_solicitante: "",
  plano_saude: "",
  num_atendimentos: "",
  consultor: "",
  data_consulta: new Date().toISOString().split("T")[0],
  telefone: "",
  email: "",
  endereco: "",
  cpf: "",
  num_prontuario: "",
  data_avaliacao: new Date().toISOString().split("T")[0],

  alimentacao: "",
  sono: "",
  hidratacao: "",
  rotina_diaria: "",
  atividade_fisica: "",
  medicamentos: "",
  tabagismo: "",
  etilismo: "",
  estresse: "",
  trabalho_repetitivo: "",
  trabalho_repetitivo_qual: "",
  historico_esportivo: "",
  historico_esportivo_qual: "",

  pa: "",
  fc: "",
  fr: "",
  sato2: "",
  temperatura: "",
  peso: "",
  altura: "",
  glicemia: "",

  hda: "",
  hdp: "",
  eva: 0,
  inicio_dor: "",
  tipo_dor: "",
  irradiacao: "",
  fatores_melhora: "",
  fatores_piora: "",
  cirurgias_previas: "",

  inspecao: "",
  palpacao: "",
  postura_estatica: "",
  postura_dinamica: "",
  marcha: "",
  perimetria: "",
  testes_especiais: "",

  adm_linhas: [
    { id: "1", movimento: "", adm_direita: "", adm_esquerda: "", forca_direita: "", forca_esquerda: "", deficit_pct: "", classificacao: "" }
  ],

  prescricoes: [
    { id: "1", descricao: "", objetivo: "", frequencia: "", quantidade: "", progressao: "", observacao: "" }
  ],

  estrategia_curto: "",
  estrategia_medio: "",
  estrategia_longo: "",

  evolucoes: [
    { id: "1", data: new Date().toISOString().split("T")[0], fisio: "Dr. Daniel Barcellos — CREFITO 10 389091-F", descricao: "", resposta: "", ajuste: "" }
  ],

  consent_fotos: false,
  consent_faltas: false,
  consent_reposicao: false,
};

export function useFicha() {
  const [ficha, setFicha] = useState<FichaData>(defaultFicha);

  const update = useCallback(<K extends keyof FichaData>(field: K, value: FichaData[K]) => {
    setFicha(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateAdmLinha = useCallback((id: string, field: keyof AdmLinha, value: string) => {
    setFicha(prev => ({
      ...prev,
      adm_linhas: prev.adm_linhas.map(l => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };
        // Auto-calculate deficit and classification
        if (field === "forca_direita" || field === "forca_esquerda") {
          const fd = parseFloat(field === "forca_direita" ? value : l.forca_direita) || 0;
          const fe = parseFloat(field === "forca_esquerda" ? value : l.forca_esquerda) || 0;
          if (fd > 0 && fe > 0) {
            const max = Math.max(fd, fe);
            const min = Math.min(fd, fe);
            const deficit = ((max - min) / max) * 100;
            updated.deficit_pct = deficit.toFixed(1);
            // CIF classification
            if (deficit === 0) updated.classificacao = "XXX.0 — Sem déficit";
            else if (deficit <= 4) updated.classificacao = "XXX.1 — Déficit leve";
            else if (deficit <= 24) updated.classificacao = "XXX.2 — Déficit moderado";
            else if (deficit <= 49) updated.classificacao = "XXX.3 — Déficit grave";
            else updated.classificacao = "XXX.4 — Déficit completo";
          }
        }
        return updated;
      })
    }));
  }, []);

  const addAdmLinha = useCallback(() => {
    setFicha(prev => ({
      ...prev,
      adm_linhas: [...prev.adm_linhas, {
        id: Date.now().toString(),
        movimento: "", adm_direita: "", adm_esquerda: "",
        forca_direita: "", forca_esquerda: "", deficit_pct: "", classificacao: ""
      }]
    }));
  }, []);

  const removeAdmLinha = useCallback((id: string) => {
    setFicha(prev => ({ ...prev, adm_linhas: prev.adm_linhas.filter(l => l.id !== id) }));
  }, []);

  const updatePrescricao = useCallback((id: string, field: keyof Prescricao, value: string) => {
    setFicha(prev => ({
      ...prev,
      prescricoes: prev.prescricoes.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  }, []);

  const addPrescricao = useCallback(() => {
    setFicha(prev => ({
      ...prev,
      prescricoes: [...prev.prescricoes, {
        id: Date.now().toString(),
        descricao: "", objetivo: "", frequencia: "", quantidade: "", progressao: "", observacao: ""
      }]
    }));
  }, []);

  const removePrescricao = useCallback((id: string) => {
    setFicha(prev => ({ ...prev, prescricoes: prev.prescricoes.filter(p => p.id !== id) }));
  }, []);

  const updateEvolucao = useCallback((id: string, field: keyof Evolucao, value: string) => {
    setFicha(prev => ({
      ...prev,
      evolucoes: prev.evolucoes.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  }, []);

  const addEvolucao = useCallback(() => {
    setFicha(prev => ({
      ...prev,
      evolucoes: [...prev.evolucoes, {
        id: Date.now().toString(),
        data: new Date().toISOString().split("T")[0],
        fisio: "Dr. Daniel Barcellos — CREFITO 10 389091-F",
        descricao: "", resposta: "", ajuste: ""
      }]
    }));
  }, []);

  const removeEvolucao = useCallback((id: string) => {
    setFicha(prev => ({ ...prev, evolucoes: prev.evolucoes.filter(e => e.id !== id) }));
  }, []);

  // Computed values
  const idade = (() => {
    if (!ficha.data_nascimento) return "";
    const hoje = new Date();
    const nasc = new Date(ficha.data_nascimento);
    let age = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) age--;
    return age >= 0 ? `${age} anos` : "";
  })();

  const imc = (() => {
    const p = parseFloat(ficha.peso);
    const a = parseFloat(ficha.altura);
    if (!p || !a || a <= 0) return "";
    const alturaM = a > 10 ? a / 100 : a;
    return (p / (alturaM * alturaM)).toFixed(1);
  })();

  const imcClassificacao = (() => {
    const v = parseFloat(imc);
    if (isNaN(v)) return "";
    if (v < 18.5) return "Abaixo do peso";
    if (v < 25) return "Peso normal";
    if (v < 30) return "Sobrepeso";
    if (v < 35) return "Obesidade Grau I";
    if (v < 40) return "Obesidade Grau II";
    return "Obesidade Grau III";
  })();

  const fcMax = (() => {
    if (!ficha.data_nascimento) return "";
    const hoje = new Date();
    const nasc = new Date(ficha.data_nascimento);
    let age = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) age--;
    if (age < 0) return "";
    return (220 - age).toString();
  })();

  const zonaTreino = (() => {
    const fc = parseFloat(fcMax);
    if (isNaN(fc)) return "";
    return `${Math.round(fc * 0.6)} – ${Math.round(fc * 0.8)} bpm`;
  })();

  const frMax = (() => {
    const fr = parseFloat(ficha.fr);
    if (isNaN(fr)) return "";
    return `${Math.round(fr * 1.5)} irpm`;
  })();

  return {
    ficha,
    update,
    updateAdmLinha,
    addAdmLinha,
    removeAdmLinha,
    updatePrescricao,
    addPrescricao,
    removePrescricao,
    updateEvolucao,
    addEvolucao,
    removeEvolucao,
    computed: { idade, imc, imcClassificacao, fcMax, zonaTreino, frMax }
  };
}
