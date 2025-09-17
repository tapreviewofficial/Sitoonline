import { useEffect, useState } from "react";

type UserRow = {
  id: number;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  _count: { links: number };
};

export default function Admin() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<{usersCount:number;linksCount:number;clicksAllTime:number;clicks7d:number;clicks30d:number} | null>(null);

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