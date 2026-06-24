import { login } from "@/app/admin/actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-gold text-2xl text-center mb-8 tracking-widest">
          Essencia Admin
        </h1>
        {searchParams.error && (
          <p className="text-red-400 text-sm text-center mb-4 font-sans">
            Contraseña incorrecta.
          </p>
        )}
        <form action={login} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            autoFocus
            className="bg-card-bg border border-white/10 rounded px-4 py-3 text-gold-lt placeholder:text-muted focus:outline-none focus:border-gold font-sans"
          />
          <button
            type="submit"
            className="bg-gold text-dark font-sans font-medium py-3 rounded hover:opacity-90 transition-opacity"
          >
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}
