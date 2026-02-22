import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MuscleRow { id: string; articulacao: string; adm: string; forca: string; deficit: string; }
interface PrescricaoRow { id: string; descricao: string; frequencia: string; quantidade: string; objetivo: string; progressao: string; observacao: string; }
interface EvolucaoRow { id: string; data: string; resposta: string; ajuste: string; }

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

interface PDFGeneratorProps {
  form: FormData;
  musculos: MuscleRow[];
  prescricoes: PrescricaoRow[];
  evolucoes: EvolucaoRow[];
}

export async function generatePDF(props: PDFGeneratorProps) {
  const { form } = props;

  try {
    console.log('Iniciando geração de PDF...');
    
    // Criar elemento temporário com o HTML
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.backgroundColor = 'white';
    container.style.padding = '15mm';
    container.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    container.style.color = '#2c3e50';
    container.style.lineHeight = '1.6';
    container.style.zIndex = '-9999';

    const htmlContent = `
      <div style="width: 100%; background: white; color: #2c3e50;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
          <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 5px 0;">🏥 AvaliaFisio</h1>
          <p style="font-size: 12px; margin: 0; opacity: 0.95;">Ficha de Avaliação Fisioterapêutica</p>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); color: white; padding: 12px 15px; border-radius: 6px; font-size: 16px; font-weight: 700; margin-bottom: 15px;">
            👤 Identificação do Paciente
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Nome</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.nomePaciente || '—'}</div>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Data Nasc.</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.dataNascimento ? new Date(form.dataNascimento).toLocaleDateString('pt-BR') : '—'}</div>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Idade</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.idadeAtual || '—'}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Sexo</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.sexo || '—'}</div>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Profissão</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.profissao || '—'}</div>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Fisioterapeuta</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.consultor || '—'}</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); color: white; padding: 12px 15px; border-radius: 6px; font-size: 16px; font-weight: 700; margin-bottom: 15px;">
            ❤️ Sinais Vitais
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">PA</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.pa || '—'}</div>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">FC</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.fc || '—'}</div>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">IMC</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.imc || '—'}</div>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Peso</div>
              <div style="font-size: 13px; color: #2c3e50; font-weight: 500;">${form.peso || '—'}</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); color: white; padding: 12px 15px; border-radius: 6px; font-size: 16px; font-weight: 700; margin-bottom: 15px;">
            📋 Anamnese
          </div>
          <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981; margin-bottom: 10px;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Queixa Principal</div>
            <div style="font-size: 13px; color: #2c3e50;">${form.hda || '—'}</div>
          </div>
          <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">EVA</div>
            <div style="font-size: 13px; color: #2c3e50;">${form.eva || '—'}</div>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8;">
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>AvaliaFisio © 2026</p>
        </div>
      </div>
    `;

    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    console.log('Container anexado ao DOM. Convertendo para canvas...');

    // Converter para canvas
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    console.log('Canvas criado. Gerando PDF...');

    // Criar PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    console.log('PDF criado. Iniciando download...');

    // Salvar PDF
    const fileName = `AvaliaFisio_${form.nomePaciente || 'Paciente'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    console.log('Download iniciado:', fileName);

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  } finally {
    // Remover elemento temporário
    const containers = document.querySelectorAll('div[style*="left: -9999px"]');
    containers.forEach(c => {
      if (c.parentNode) c.parentNode.removeChild(c);
    });
  }
}
