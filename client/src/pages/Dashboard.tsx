import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Plus, FileText, Trash2, Eye, Download, Edit, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const listFichasQuery = trpc.fichas.list.useQuery();
  const deleteFichaMutation = trpc.fichas.delete.useMutation();
  const getUsageQuery = trpc.plans.getUsage.useQuery();
  const getCurrentPlanQuery = trpc.plans.getCurrent.useQuery();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  const handleDeleteFicha = async (fichaId: number) => {
    if (!confirm("Tem certeza que deseja deletar esta ficha?")) return;

    try {
      await deleteFichaMutation.mutateAsync({ id: fichaId });
      toast.success("Ficha deletada com sucesso!");
      listFichasQuery.refetch();
    } catch (error) {
      toast.error("Erro ao deletar ficha");
    }
  };

  const handleDownloadPDF = (pdfUrl: string | null) => {
    if (!pdfUrl) {
      toast.error("PDF não disponível");
      return;
    }
    window.open(pdfUrl, "_blank");
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Bem-vindo, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setLocation("/ficha")} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Ficha
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Plan Card */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Plano Atual</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {getCurrentPlanQuery.data?.planType === "premium" ? "Premium" : "Free"}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {getCurrentPlanQuery.data?.planType === "premium"
                    ? "Acesso ilimitado"
                    : "3 fichas/mês"}
                </p>
              </div>
              <Badge variant={getCurrentPlanQuery.data?.planType === "premium" ? "default" : "secondary"}>
                {getCurrentPlanQuery.data?.planType === "premium" ? "Premium" : "Free"}
              </Badge>
            </div>
          </Card>

          {/* Usage Card */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-2">Uso Este Mês</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {getUsageQuery.data?.current || 0}/{getUsageQuery.data?.limit === Infinity ? "∞" : getUsageQuery.data?.limit}
                </p>
                <p className="text-sm text-slate-600 mt-1">fichas criadas</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 font-bold">
                  {getUsageQuery.data?.limit === Infinity
                    ? "∞"
                    : Math.round(((getUsageQuery.data?.current || 0) / (getUsageQuery.data?.limit || 1)) * 100)}
                  %
                </span>
              </div>
            </div>
          </Card>

          {/* Upgrade Card */}
          {getCurrentPlanQuery.data?.planType === "free" && (
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <h3 className="text-sm font-medium text-emerald-900 mb-2">Upgrade para Premium</h3>
              <p className="text-sm text-emerald-700 mb-4">
                Acesso ilimitado a fichas + Google Drive integrado
              </p>
              <Button
                onClick={() => setLocation("/pricing")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Ver Planos
              </Button>
            </Card>
          )}
        </div>

        {/* Fichas List */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Minhas Fichas</h2>

          {listFichasQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : listFichasQuery.data && listFichasQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listFichasQuery.data.map((ficha: any) => (
                <Card key={ficha.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{ficha.nomePaciente}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {new Date(ficha.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge variant="outline">{ficha.sexo}</Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-slate-600">
                    {ficha.diagnosticoClinico && (
                      <p><strong>Diagnóstico:</strong> {ficha.diagnosticoClinico}</p>
                    )}
                    {ficha.eva && (
                      <p><strong>EVA:</strong> {ficha.eva}/10</p>
                    )}
                    {ficha.imc && (
                      <p><strong>IMC:</strong> {ficha.imc} ({ficha.classificacaoIMC})</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setLocation(`/ficha/${ficha.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    {ficha.pdfUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(ficha.pdfUrl)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteFicha(ficha.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Nenhuma ficha criada ainda</p>
              <Button onClick={() => setLocation("/ficha")} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Ficha
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
