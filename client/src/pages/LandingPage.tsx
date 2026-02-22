import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  CheckCircle2,
  BarChart3,
  Cloud,
  Lock,
  Zap,
  Users,
  FileText,
  Heart,
  ArrowRight,
  Star,
} from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: FileText,
      title: "Ficha Completa",
      description: "12 seções profissionais com cálculos automáticos (IMC, FC Máx, CIF)",
    },
    {
      icon: BarChart3,
      title: "Relatórios Inteligentes",
      description: "Análise de evolução do paciente com gráficos e insights automáticos",
    },
    {
      icon: Cloud,
      title: "Google Drive Integrado",
      description: "Sincronização automática de PDFs na nuvem (plano Premium)",
    },
    {
      icon: Lock,
      title: "Segurança LGPD",
      description: "Criptografia end-to-end e conformidade com legislação brasileira",
    },
    {
      icon: Zap,
      title: "Geração de PDF",
      description: "PDFs profissionais prontos para impressão em segundos",
    },
    {
      icon: Users,
      title: "Multiusuário",
      description: "Gerencie múltiplos fisioterapeutas e pacientes em um único dashboard",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Carlos Silva",
      role: "Fisioterapeuta Clínico",
      text: "Beyond Avaliação revolucionou meu atendimento. Ganhei 2 horas por dia em documentação.",
      rating: 5,
    },
    {
      name: "Dra. Mariana Costa",
      role: "Coordenadora de Clínica",
      text: "Implementamos em toda a clínica. Nossos pacientes adoram receber os relatórios em PDF.",
      rating: 5,
    },
    {
      name: "Prof. João Mendes",
      role: "Pesquisador - USP",
      text: "Excelente ferramenta para pesquisa clínica. Dados estruturados e confiáveis.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "3 fichas por mês",
        "Todas as 12 seções",
        "Geração de PDF local",
        "Suporte por email",
      ],
      cta: "Começar Grátis",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "R$ 49,90",
      period: "/mês",
      description: "Para profissionais",
      features: [
        "Fichas ilimitadas",
        "Google Drive automático",
        "Relatórios avançados",
        "Análise de evolução",
        "Exportar em Excel/CSV",
        "Suporte prioritário",
        "Sem anúncios",
      ],
      cta: "Assinar Premium",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Para clínicas e pesquisa",
      features: [
        "Tudo do Premium",
        "Múltiplos usuários",
        "API customizada",
        "Integração com PEP",
        "Suporte 24/7",
        "SLA garantido",
        "Treinamento incluído",
      ],
      cta: "Contato Comercial",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "Meus dados estão seguros?",
      answer:
        "Sim! Utilizamos criptografia end-to-end, backup automático e conformidade total com LGPD. Todos os dados são armazenados em servidores seguros com certificação ISO 27001.",
    },
    {
      question: "Posso usar offline?",
      answer:
        "Sim! A ficha funciona offline e sincroniza automaticamente quando você reconecta à internet.",
    },
    {
      question: "Como funciona o limite de fichas?",
      answer:
        "No plano Free, você pode criar 3 fichas por mês. No Premium, é ilimitado. O contador reseta todo dia 1º do mês.",
    },
    {
      question: "Posso exportar meus dados?",
      answer:
        "Sim! Você pode exportar suas fichas em PDF, Excel ou CSV a qualquer momento. Seus dados são seus.",
    },
    {
      question: "Há período de teste?",
      answer:
        "Sim! O plano Free é permanente. Teste todas as funcionalidades sem cartão de crédito.",
    },
    {
      question: "Como é o suporte?",
      answer:
        "Oferecemos suporte por email (Free) e chat prioritário (Premium). Resposta em até 24h.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Beyond Avaliação</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/login")}
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Entrar
            </button>
            <Button
              onClick={() => setLocation("/register")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Começar Grátis
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Ficha de Avaliação Fisioterapêutica Profissional
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Sistema completo baseado em evidências científicas. Crie fichas profissionais,
                gere relatórios inteligentes e sincronize com Google Drive automaticamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setLocation("/register")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6 px-8"
                >
                  Começar Grátis <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="text-lg py-6 px-8 border-2"
                >
                  Ver Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Sem cartão de crédito
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  3 fichas grátis/mês
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-24 h-24 text-emerald-600 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Ficha Profissional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Funcionalidades Completas</h2>
            <p className="text-xl text-slate-600">
              Tudo que você precisa para avaliações fisioterapêuticas profissionais
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition">
                  <Icon className="w-12 h-12 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Planos Simples e Transparentes</h2>
            <p className="text-xl text-slate-600">
              Escolha o plano perfeito para suas necessidades
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition ${
                  plan.highlighted
                    ? "bg-emerald-600 text-white shadow-2xl scale-105"
                    : "bg-white border border-slate-200 text-slate-900"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={plan.highlighted ? "text-emerald-100" : "text-slate-600"}>
                  {plan.description}
                </p>
                <div className="my-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.highlighted ? "text-emerald-100" : "text-slate-600"}>
                    {plan.period}
                  </span>
                </div>
                <Button
                  className={`w-full mb-8 ${
                    plan.highlighted
                      ? "bg-white text-emerald-600 hover:bg-slate-100"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">O que Dizem Sobre Nós</h2>
            <p className="text-xl text-slate-600">
              Profissionais que confiam em Beyond Avaliação
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-slate-200">
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 cursor-pointer group"
              >
                <summary className="font-semibold text-slate-900 flex items-center justify-between">
                  {faq.question}
                  <span className="text-emerald-600 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-slate-600 mt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Crie sua primeira ficha em menos de 2 minutos. Sem cartão de crédito necessário.
          </p>
          <Button
            onClick={() => setLocation("/register")}
            className="bg-white text-emerald-600 hover:bg-slate-100 text-lg py-6 px-8"
          >
            Começar Grátis Agora <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">Beyond Avaliação</span>
              </div>
              <p className="text-sm">Ficha de avaliação fisioterapêutica profissional.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition">Preços</a></li>
                <li><a href="#" className="hover:text-white transition">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Beyond Avaliação. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
