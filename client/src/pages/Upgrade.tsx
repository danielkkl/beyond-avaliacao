import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  CreditCard,
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Upgrade() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  const plans = [
    {
      name: "Monthly",
      price: 49.90,
      period: "/mês",
      description: "Perfeito para profissionais",
      features: [
        "Fichas ilimitadas",
        "Google Drive automático",
        "Relatórios avançados",
        "Análise de evolução",
        "Exportar em Excel/CSV",
        "Suporte prioritário",
        "Sem anúncios",
      ],
      value: "monthly" as const,
      savings: null,
    },
    {
      name: "Yearly",
      price: 499.00,
      period: "/ano",
      description: "Melhor valor",
      features: [
        "Fichas ilimitadas",
        "Google Drive automático",
        "Relatórios avançados",
        "Análise de evolução",
        "Exportar em Excel/CSV",
        "Suporte prioritário",
        "Sem anúncios",
      ],
      value: "yearly" as const,
      savings: "2 meses grátis",
    },
  ];

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const origin = window.location.origin;
      const result = await createCheckoutMutation.mutateAsync({
        planType: selectedPlan,
        successUrl: `${origin}/dashboard?payment=success`,
        cancelUrl: `${origin}/upgrade?payment=cancelled`,
      });

      if (result.sessionUrl) {
        window.location.href = result.sessionUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar sessão de checkout");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/dashboard")}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Upgrade para Premium</h1>
              <p className="text-slate-600 mt-1">Desbloqueie todas as funcionalidades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Info Alert */}
        <Alert className="mb-8 border-emerald-200 bg-emerald-50">
          <AlertCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            <strong>Você está no plano Free.</strong> Upgrade agora para desbloquear fichas ilimitadas, Google Drive automático e relatórios avançados.
          </AlertDescription>
        </Alert>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.value}
              className={`p-8 cursor-pointer transition ${
                selectedPlan === plan.value
                  ? "ring-2 ring-emerald-600 shadow-lg"
                  : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedPlan(plan.value)}
            >
              {plan.savings && (
                <div className="mb-4 inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {plan.savings}
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-slate-900">
                  R$ {plan.price.toFixed(2)}
                </span>
                <span className="text-slate-600">{plan.period}</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full mb-8 py-6 text-lg font-semibold ${
                  selectedPlan === plan.value
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Assinar Agora
                  </>
                )}
              </Button>

              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Comparação de Planos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Funcionalidade</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Fichas por mês", free: "3", premium: "Ilimitadas" },
                  { feature: "Todas as 12 seções", free: "✓", premium: "✓" },
                  { feature: "Geração de PDF", free: "✓", premium: "✓" },
                  { feature: "Google Drive automático", free: "✗", premium: "✓" },
                  { feature: "Relatórios avançados", free: "✗", premium: "✓" },
                  { feature: "Análise de evolução", free: "✗", premium: "✓" },
                  { feature: "Exportar Excel/CSV", free: "✗", premium: "✓" },
                  { feature: "Suporte por email", free: "✓", premium: "✓" },
                  { feature: "Suporte prioritário", free: "✗", premium: "✓" },
                  { feature: "Sem anúncios", free: "✗", premium: "✓" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.free === "✓" ? (
                        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-slate-400">✗</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.premium === "✓" || row.premium === "Ilimitadas" ? (
                        row.premium === "Ilimitadas" ? (
                          <span className="font-semibold text-emerald-600">{row.premium}</span>
                        ) : (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-400">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Você pode cancelar sua assinatura a qualquer momento. Seu acesso continuará até o final do período de cobrança.",
              },
              {
                q: "Há período de teste?",
                a: "Não, mas você pode usar o plano Free indefinidamente com 3 fichas/mês.",
              },
              {
                q: "Como funciona a renovação?",
                a: "Sua assinatura renova automaticamente no mesmo dia de cada mês (ou ano). Você receberá um aviso antes.",
              },
              {
                q: "Posso mudar de plano?",
                a: "Sim! Você pode fazer upgrade ou downgrade a qualquer momento. O valor será ajustado proporcionalmente.",
              },
            ].map((faq, idx) => (
              <details key={idx} className="bg-white p-6 rounded-lg border border-slate-200 cursor-pointer">
                <summary className="font-semibold text-slate-900 flex items-center justify-between">
                  {faq.q}
                  <span className="text-emerald-600 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-slate-600 mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <Card className="p-8 mt-12 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Métodos de Pagamento</h3>
          <p className="text-slate-600 mb-4">
            Aceitamos cartões de crédito e débito via Stripe. Seu pagamento é seguro e criptografado.
          </p>
          <div className="flex gap-4">
            {["Visa", "Mastercard", "American Express"].map((card) => (
              <div key={card} className="px-4 py-2 bg-white border border-slate-200 rounded-lg">
                <span className="text-sm font-medium text-slate-700">{card}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
