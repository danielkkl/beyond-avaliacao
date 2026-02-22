import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Check, Cloud, Zap, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Pricing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  const plans = [
    {
      name: "Free",
      price: "Grátis",
      description: "Perfeito para começar",
      features: [
        { text: "3 fichas por mês", included: true },
        { text: "Geração de PDF", included: true },
        { text: "Edição básica", included: true },
        { text: "Google Drive", included: false },
        { text: "Suporte prioritário", included: false },
        { text: "Relatórios avançados", included: false },
      ],
      cta: "Plano Atual",
      ctaDisabled: true,
      highlighted: false,
    },
    {
      name: "Premium Mensal",
      price: "$29.99",
      period: "/mês",
      description: "Acesso completo",
      features: [
        { text: "Fichas ilimitadas", included: true },
        { text: "Geração de PDF automática", included: true },
        { text: "Google Drive integrado", included: true },
        { text: "Suporte prioritário", included: true },
        { text: "Backup automático", included: true },
        { text: "Relatórios avançados", included: true },
      ],
      cta: "Assinar Agora",
      ctaDisabled: false,
      highlighted: true,
      planType: "monthly",
    },
    {
      name: "Premium Anual",
      price: "$299.99",
      period: "/ano",
      description: "Melhor valor (17% de desconto)",
      features: [
        { text: "Fichas ilimitadas", included: true },
        { text: "Geração de PDF automática", included: true },
        { text: "Google Drive integrado", included: true },
        { text: "Suporte prioritário", included: true },
        { text: "Backup automático", included: true },
        { text: "Relatórios avançados", included: true },
      ],
      cta: "Assinar Agora",
      ctaDisabled: false,
      highlighted: false,
      planType: "yearly",
    },
  ];

  const handleCheckout = async (planType: "monthly" | "yearly") => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      setLocation("/");
      return;
    }

    try {
      const result = await createCheckoutMutation.mutateAsync({
        planType,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      if (result.sessionUrl) {
        window.open(result.sessionUrl, "_blank");
      }
    } catch (error) {
      toast.error("Erro ao criar sessão de checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">AvaliaFisio</h1>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Planos Simples e Transparentes
          </h2>
          <p className="text-xl text-slate-600">
            Escolha o plano perfeito para sua clínica
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan: any) => (
            <Card
              key={plan.name}
              className={`relative p-8 transition-all ${
                plan.highlighted
                  ? "ring-2 ring-emerald-500 shadow-xl scale-105"
                  : "hover:shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-600 text-sm mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-600">{plan.period}</span>}
                </div>
              </div>

              <Button
                onClick={() => {
                  if (plan.planType) {
                    handleCheckout(plan.planType);
                  }
                }}
                disabled={plan.ctaDisabled || createCheckoutMutation.isPending}
                className={`w-full mb-8 ${
                  plan.highlighted
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                }`}
              >
                {createCheckoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  plan.cta
                )}
              </Button>

              <div className="space-y-4">
                {plan.features.map((feature: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 border border-slate-300 rounded flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feature.included
                          ? "text-slate-700 text-sm"
                          : "text-slate-400 line-through text-sm"
                      }
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Perguntas Frequentes
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Posso mudar de plano a qualquer momento?
              </h4>
              <p className="text-slate-600">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer
                momento. As mudanças entram em vigor imediatamente.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Há período de teste gratuito?
              </h4>
              <p className="text-slate-600">
                O plano Free é permanente e gratuito. Você pode testar todas as
                funcionalidades básicas sem cartão de crédito.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Como funciona a integração com Google Drive?
              </h4>
              <p className="text-slate-600">
                No plano Premium, seus PDFs são salvos automaticamente no Google
                Drive. Você controla o acesso e pode compartilhar com pacientes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
