import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, Users, Eye, EyeOff } from "lucide-react";

type UserRow = {
  id: number;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  _count: { links: number };
};

const createUserSchema = z.object({
  email: z.string().email("Email non valida"),
  username: z.string().min(3, "Username minimo 3 caratteri"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  tempPassword: z.string().min(8, "Password temporanea minimo 8 caratteri")
});

type CreateUserForm = z.infer<typeof createUserSchema>;

export default function Admin() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{usersCount:number;linksCount:number;clicksAllTime:number;clicks7d:number;clicks30d:number} | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Form per creazione utenti
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      username: "",
      role: "USER",
      tempPassword: ""
    }
  });

  // Mutation per creare utente
  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserForm) => {
      return await apiRequest("POST", "/api/admin/users", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Utente creato",
        description: `Account creato per ${data.user.username}. L'utente dovrà cambiare password al primo accesso.`,
      });
      form.reset();
      setShowCreateForm(false);
      // Ricarica la lista utenti
      setPage(1);
      window.location.reload(); // Semplice reload per aggiornare stats e lista
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    fetch(`/api/admin/users?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`, { credentials: "include" })
      .then(async r => {
        if (!r.ok) {
          if (r.status === 403 || r.status === 401) {
            console.log('Non autorizzato per pannello admin');
            window.location.href = '/dashboard';
            return;
          }
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      })
      .then(d => { 
        if (d) {
          setUsers(d.users || []); 
          setTotal(d.total || 0); 
        }
      })
      .catch(err => {
        console.error('Errore caricamento utenti:', err);
        setUsers([]);
        setTotal(0);
      });
  }, [query, page, pageSize]);

  useEffect(() => {
    fetch("/api/admin/stats/summary", { credentials: "include" })
      .then(async r => {
        if (!r.ok) {
          if (r.status === 403 || r.status === 401) {
            console.log('Non autorizzato per statistiche admin');
            return null;
          }
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        if (data) {
          setStats(data);
        }
      })
      .catch(err => {
        console.error('Errore caricamento statistiche:', err);
        setStats(null);
      });
  }, []);

  const impersona = async (id: number) => {
    await fetch(`/api/admin/impersonate/${id}`, { method: "POST", credentials: "include" });
    window.location.href = "/dashboard";
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-[#CC9900]">Admin Panel</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Utenti" value={stats?.usersCount ?? 0} />
          <StatCard title="Link" value={stats?.linksCount ?? 0} />
          <StatCard title="Click (totali)" value={stats?.clicksAllTime ?? 0} />
          <StatCard title="Click 7g" value={stats?.clicks7d ?? 0} />
          <StatCard title="Click 30g" value={stats?.clicks30d ?? 0} />
        </div>

        {/* Create User Section */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-[#CC9900] hover:bg-[#CC9900]/80 text-black font-medium"
              data-testid="button-show-create-form"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Crea Nuovo Utente
            </Button>
          ) : (
            <Card className="border-[#CC9900]/20 bg-black/50">
              <CardHeader>
                <CardTitle className="text-[#CC9900] flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Crea Nuovo Utente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit((data) => createUserMutation.mutate(data))} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-white/80">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="utente@example.com"
                        {...form.register("email")}
                        className="bg-black/50 border-white/20 text-white focus:border-[#CC9900]"
                        data-testid="input-create-email"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                    {/* Username */}
                    <div>
                      <Label htmlFor="username" className="text-white/80">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="nome_utente"
                        {...form.register("username")}
                        className="bg-black/50 border-white/20 text-white focus:border-[#CC9900]"
                        data-testid="input-create-username"
                      />
                      {form.formState.errors.username && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.username.message}</p>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <Label className="text-white/80">Ruolo</Label>
                      <Select 
                        value={form.watch("role")} 
                        onValueChange={(value: "USER" | "ADMIN") => form.setValue("role", value)}
                      >
                        <SelectTrigger className="bg-black/50 border-white/20 text-white focus:border-[#CC9900]" data-testid="select-create-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Temporary Password */}
                    <div>
                      <Label htmlFor="tempPassword" className="text-white/80">Password Temporanea</Label>
                      <div className="relative">
                        <Input
                          id="tempPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimo 8 caratteri"
                          {...form.register("tempPassword")}
                          className="bg-black/50 border-white/20 text-white focus:border-[#CC9900] pr-10"
                          data-testid="input-create-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {form.formState.errors.tempPassword && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.tempPassword.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={createUserMutation.isPending}
                      className="bg-[#CC9900] hover:bg-[#CC9900]/80 text-black font-medium"
                      data-testid="button-submit-create-user"
                    >
                      {createUserMutation.isPending ? "Creazione..." : "Crea Utente"}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        form.reset();
                      }}
                      className="border-white/20 text-white hover:bg-white/10"
                      data-testid="button-cancel-create"
                    >
                      Annulla
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-2">
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Cerca per email / username / display name"
            className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-2 outline-none focus:border-[#CC9900]"
          />
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="p-3">Email</th>
                <th className="p-3">Username</th>
                <th className="p-3">Ruolo</th>
                <th className="p-3"># Link</th>
                <th className="p-3 w-1">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">{u._count?.links ?? 0}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => impersona(u.id)} 
                      className="px-3 py-1 rounded-lg bg-[#CC9900] hover:bg-[#CC9900]/80 text-black text-sm font-medium transition-colors"
                    >
                      Impersona
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-white/60" colSpan={5}>
                    Nessun utente trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-white/60 text-sm">
            Mostrati {users.length} di {total} utenti
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page<=1} 
              onClick={() => setPage(p=>p-1)} 
              className="px-3 py-1 rounded-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
            >
              « Prev
            </button>
            <span className="text-white/60 mx-2">
              Pagina {page} di {pages}
            </span>
            <button 
              disabled={page>=pages} 
              onClick={() => setPage(p=>p+1)} 
              className="px-3 py-1 rounded-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="text-white/60 text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-[#CC9900]">
        {value.toLocaleString()}
      </div>
    </div>
  );
}