import Link from "next/link";
import { prisma } from "@/lib/db";
import { ItemCard } from "@/components/item-card";
import { SearchIcon, PlusIcon } from "@/components/icons";
import { ItemStatus } from "@/generated/prisma/client";

const CATEGORIES = ["roupas", "calçados", "beleza", "casa", "eletrônicos", "livros", "outros"];

const STATUS_OPTIONS: { value: ItemStatus; label: string }[] = [
  { value: ItemStatus.QUERO, label: "quero" },
  { value: ItemStatus.COMPRADO, label: "comprado" },
  { value: ItemStatus.DESISTI, label: "desisti" },
];

const SORT_OPTIONS = [
  { value: "recente", label: "mais recente" },
  { value: "preco", label: "menor preço" },
  { value: "nome", label: "nome a-z" },
];

type SearchParams = {
  categoria?: string;
  status?: string;
  q?: string;
  ordenar?: string;
};

function parseStatusParam(raw: string | undefined): ItemStatus {
  if (raw === ItemStatus.COMPRADO || raw === ItemStatus.DESISTI || raw === ItemStatus.QUERO) {
    return raw;
  }
  return ItemStatus.QUERO;
}

function buildHref(base: SearchParams, overrides: SearchParams): string {
  const merged = { ...base, ...overrides };
  const params = new URLSearchParams();
  if (merged.categoria) params.set("categoria", merged.categoria);
  if (merged.status) params.set("status", merged.status);
  if (merged.q) params.set("q", merged.q);
  if (merged.ordenar) params.set("ordenar", merged.ordenar);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function VitrinePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const status = parseStatusParam(sp.status);
  const categoria = sp.categoria;
  const q = sp.q?.trim();
  const ordenar = sp.ordenar ?? "recente";

  const items = await prisma.item.findMany({
    where: {
      status,
      category: categoria || undefined,
      name: q ? { contains: q, mode: "insensitive" } : undefined,
    },
    include: { priceEntries: { orderBy: { researchedAt: "desc" } } },
  });

  const sorted = [...items].sort((a, b) => {
    if (ordenar === "preco") {
      const pa = a.priceEntries[0] ? Number(a.priceEntries[0].price.toString()) : Infinity;
      const pb = b.priceEntries[0] ? Number(b.priceEntries[0].price.toString()) : Infinity;
      return pa - pb;
    }
    if (ordenar === "nome") return a.name.localeCompare(b.name, "pt-BR");
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>meus desejos</h1>
          <p className="tagline">tudo que eu quero, num cantinho só ✎</p>
        </div>
        <form className="search-box" action="/" method="get">
          <SearchIcon />
          <label htmlFor="busca" className="visually-hidden">
            Buscar desejo
          </label>
          <input id="busca" type="search" name="q" placeholder="buscar um desejo..." defaultValue={q ?? ""} />
          {categoria && <input type="hidden" name="categoria" value={categoria} />}
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="ordenar" value={ordenar} />
        </form>
      </header>

      <div className="filters">
        <Link href={buildHref(sp, { categoria: undefined })} className={`chip${!categoria ? " chip-active" : ""}`}>
          tudo
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={buildHref(sp, { categoria: cat === categoria ? undefined : cat })}
            className={`chip${categoria === cat ? " chip-active" : ""}`}
          >
            {cat}
          </Link>
        ))}

        <div style={{ flex: "1 1 20px" }} />

        <div className="segmented" role="group" aria-label="status">
          {STATUS_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildHref(sp, { status: opt.value })}
              className={`seg${status === opt.value ? " seg-active" : ""}`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        <form action="/" method="get" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label htmlFor="ordenar" className="visually-hidden">
            Ordenar
          </label>
          {categoria && <input type="hidden" name="categoria" value={categoria} />}
          <input type="hidden" name="status" value={status} />
          {q && <input type="hidden" name="q" value={q} />}
          <select id="ordenar" name="ordenar" defaultValue={ordenar} className="sort-select">
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button type="submit" className="chip" aria-label="aplicar ordenação">
            ir
          </button>
        </form>
      </div>

      <div className="wish-grid">
        {sorted.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
        {sorted.length === 0 && (
          <p className="empty">
            nada por aqui ainda — que tal <Link href="/novo">adicionar um desejo</Link>?
          </p>
        )}
      </div>

      <Link href="/novo" className="fab" aria-label="Adicionar novo desejo">
        <PlusIcon />
      </Link>
    </div>
  );
}
