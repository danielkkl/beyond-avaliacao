import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Heart,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Lock,
  Cloud,
  Users,
  Smartphone,
  Shield,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Heart,
      title: "Fichas Completas",
      description: "Ficha de avaliação fisioterapêutica com 12 seções profissionais",
    },
    {
      icon: Zap,
      title: "Geração de PDF",
      description: "Gere PDFs profissionais com um clique",
    },
    {
      icon: CheckCircle,
      title: "Histórico de Pacientes",
      description: "Acesse todas as fichas anteriores facilmente",
    },
  ];

  const advancedFeatures = [
    {
      icon: BarChart3,
      title: "Relatórios Avançados",
      description: "Análise completa de evolução do paciente com gráficos",
    },
    {
      icon: Cloud,
      title: "Google Drive Automático",
      description: "Salve suas fichas automaticamente na nuvem",
    },
    {
      icon: Users,
      title: "Gestão de Pacientes",
      description: "Organize todos os seus pacientes em um só lugar",
    },
    {
      icon: Smartphone,
      title: "Responsivo",
      description: "Funciona perfeitamente em desktop, tablet e mobile",
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Seus dados são protegidos com criptografia SSL",
    },
    {
      icon: Lightbulb,
      title: "Intuitivo",
      description: "Interface fácil de usar, sem necessidade de treinamento",
    },
  ];

  const testimonials = [
    {
      name: "Dra. Ana Silva",
      role: "Fisioterapeuta",
      text: "Beyond Avaliação revolucionou minha prática clínica. Ganho tempo e tenho dados mais organizados.",
      avatar: "AS",
    },
    {
      name: "Dr. Carlos Mendes",
      role: "Clínica Fisioterapia",
      text: "Excelente ferramenta para gerenciar múltiplos pacientes. Recomendo para todos os colegas.",
      avatar: "CM",
    },
    {
      name: "Fernanda Costa",
      role: "Fisioterapeuta Autônoma",
      text: "O sistema de relatórios me ajuda a mostrar progresso aos meus pacientes de forma clara.",
      avatar: "FC",
    },
  ];

  const faqs = [
    {
      q: "Como funciona o plano Free?",
      a: "O plano Free permite criar até 3 fichas por mês. Você tem acesso a todas as 12 seções da ficha e pode gerar PDFs.",
    },
    {
      q: "Posso cancelar minha assinatura?",
      a: "Sim! Você pode cancelar sua assinatura Premium a qualquer momento. Seu acesso continuará até o final do período de cobrança.",
    },
    {
      q: "Meus dados são seguros?",
      a: "Sim! Usamos criptografia SSL e seguimos as melhores práticas de segurança. Seus dados estão protegidos.",
    },
    {
      q: "Posso exportar meus dados?",
      a: "Sim! No plano Premium você pode exportar suas fichas em PDF, Excel e CSV.",
    },
    {
      q: "Há suporte técnico?",
      a: "Sim! Oferecemos suporte por email. Clientes Premium têm suporte prioritário.",
    },
    {
      q: "Como funciona o Google Drive?",
      a: "No plano Premium, suas fichas são salvas automaticamente no seu Google Drive pessoal.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Beyond Avaliação</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition">
              Recursos
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition">
              Preços
            </a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/login")}>
              Entrar
            </Button>
            <Button onClick={() => setLocation("/register")} className="bg-emerald-600 hover:bg-emerald-700">
              Registrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              ✨ Solução Completa para Fisioterapeutas
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Fichas de Avaliação Fisioterapêutica Profissionais
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Sistema completo para criar, gerenciar e gerar PDFs de fichas de avaliação fisioterapêutica. Com relatórios avançados, Google Drive automático e análise de evolução do paciente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setLocation("/register")} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Começar Agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={() => setLocation("/pricing")} size="lg" variant="outline">
                Ver Planos
              </Button>
            </div>
            <p className="text-sm text-slate-600 mt-6">
              ✓ Sem cartão de crédito necessário • ✓ 3 fichas grátis por mês • ✓ Acesso completo
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl h-96 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <Heart className="w-32 h-32 text-emerald-600 mx-auto mb-4 opacity-80" />
              <p className="text-slate-700 font-semibold text-lg">Fichas Profissionais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Recursos Principais
            </h3>
            <p className="text-xl text-slate-600">
              Tudo que você precisa para gerenciar fichas de avaliação fisioterapêutica
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-8 bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-12 h-12 text-emerald-600 mb-4" />
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Advanced Features Grid */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Recursos Premium
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {advancedFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="p-6 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <Icon className="w-10 h-10 text-blue-600 mb-3" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-slate-900 mb-4">
            O que Nossos Usuários Dizem
          </h3>
          <p className="text-xl text-slate-600">
            Confira as experiências de fisioterapeutas que já usam Beyond Avaliação
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-8 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Planos Simples e Transparentes
            </h3>
            <p className="text-xl text-slate-600">
              Escolha o plano que melhor se adequa ao seu negócio
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="p-8 bg-white border border-slate-200 rounded-lg">
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Free</h4>
              <p className="text-slate-600 mb-6">Para começar</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">R$ 0</span>
                <span className="text-slate-600">/mês</span>
              </div>
              <Button
                onClick={() => setLocation("/register")}
                variant="outline"
                className="w-full mb-8"
              >
                Começar Agora
              </Button>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  3 fichas por mês
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Todas as 12 seções
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Geração de PDF
                </li>
              </ul>
            </div>

            {/* Premium Plan */}
            <div className="p-8 bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-600 rounded-lg shadow-lg">
              <div className="inline-block mb-4 px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold">
                POPULAR
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Premium</h4>
              <p className="text-slate-600 mb-6">Para profissionais</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">R$ 49,90</span>
                <span className="text-slate-600">/mês</span>
              </div>
              <Button
                onClick={() => setLocation("/register")}
                className="w-full mb-8 bg-emerald-600 hover:bg-emerald-700"
              >
                Assinar Agora
              </Button>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Fichas ilimitadas
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Google Drive automático
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Relatórios avançados
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Análise de evolução
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Exportar em Excel/CSV
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-slate-900 mb-4">
            Perguntas Frequentes
          </h3>
          <p className="text-xl text-slate-600">
            Respostas para as dúvidas mais comuns
          </p>
        </div>
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="p-6 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:shadow-md transition"
            >
              <summary className="font-semibold text-slate-900 flex items-center justify-between">
                {faq.q}
                <span className="text-emerald-600">▼</span>
              </summary>
              <p className="text-slate-600 mt-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-12 text-center text-white shadow-lg">
          <h3 className="text-4xl font-bold mb-4">
            Pronto para começar?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Crie sua conta gratuitamente e comece a usar agora mesmo. 3 fichas grátis por mês.
          </p>
          <Button
            onClick={() => setLocation("/register")}
            size="lg"
            className="bg-white text-emerald-600 hover:bg-slate-100"
          >
            Criar Conta Gratuita
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Preços</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">LGPD</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <p className="text-slate-400 text-sm">
                Email: contato@beyondavaliacao.com.br
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Beyond Avaliação. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
