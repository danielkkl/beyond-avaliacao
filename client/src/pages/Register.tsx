import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState } from "react";
import { AlertCircle, Loader2, LogIn, Heart, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Register() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerMutation = trpc.auth.register.useMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validações básicas
    if (!name || !email || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres");
      setLoading(false);
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        name,
        email,
        password,
      });

      if (result.success && result.userId) {
        setSuccess(true);
        localStorage.setItem("userId", result.userId.toString());
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          setLocation("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Conta Criada com Sucesso!</h2>
            <p className="text-slate-600">
              Bem-vindo ao Beyond Avaliação. Você será redirecionado para o dashboard em breve...
            </p>
            <div className="animate-spin inline-block">
              <Loader2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Beyond Avaliação</h1>
          </div>
          <p className="text-slate-600">Crie sua conta</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                disabled={loading}
                required
              />
              <p className="text-xs text-slate-500 mt-1">Mínimo 8 caracteres</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2"
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">Ou registre com</span>
            </div>
          </div>

          <Button
            onClick={() => window.location.href = getLoginUrl()}
            variant="outline"
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Registrar com Manus
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Já tem conta?{" "}
          <button
            onClick={() => setLocation("/login")}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Faça login aqui
          </button>
        </div>
      </div>
    </div>
  );
}
