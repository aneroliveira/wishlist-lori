import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { tapeColorFor, rotationFor, STATUS_LABEL } from "@/lib/visual";
import { formatPrice, formatDateShort, formatDateLong, hostnameOf } from "@/lib/format";
import { PhotoPlaceholderIcon } from "@/components/icons";
import { addPriceEntry, updateStatus, deleteItem } from "../../actions";
import { ItemStatus } from "@/generated/prisma/client";

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
    include: { priceEntries: { orderBy: { researchedAt: "desc" } } },
  });

  if (!item) {
    notFound();
  }

  const prices = item.priceEntries;
  const lowest = prices.length
    ? prices.reduce((min, p) => (Number(p.price.toString()) < Number(min.price.toString()) ? p : min))
    : null;
  const sourceLabel = item.link ? hostnameOf(item.link) : null;

  const addPriceWithId = addPriceEntry.bind(null, item.id);
  const markPurchased = updateStatus.bind(null, item.id, ItemStatus.COMPRADO);
  const markWanted = updateStatus.bind(null, item.id, ItemStatus.QUERO);
  const markGaveUp = updateStatus.bind(null, item.id, ItemStatus.DESISTI);
  const removeItem = deleteItem.bind(null, item.id);

  return (
    <div className="page detail-page">
      <Link href="/" className="back-link">
        ← voltar pra vitrine
      </Link>

      <div className="detail-layout">
        <div className="detail-photo-col">
          <div className="card" style={{ transform: rotationFor(item.id) }}>
            <div className="tape" style={{ background: tapeColorFor(item.category) }}>
              {item.category}
            </div>
            <div className="card-photo">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 560px) 90vw, 440px" />
              ) : (
                <div className="photo-placeholder">
                  <PhotoPlaceholderIcon />
                </div>
              )}
              {item.status === "COMPRADO" && (
                <div className="stamp-bought">
                  comprado
                  <br />✓
                </div>
              )}
              {prices[0] && (
                <div className="price-badge">
                  <div className="price-now">R$ {formatPrice(prices[0].price.toString())}</div>
                  {prices[1] && Number(prices[1].price.toString()) !== Number(prices[0].price.toString()) && (
                    <div className="price-was">antes R$ {formatPrice(prices[1].price.toString())}</div>
                  )}
                </div>
              )}
            </div>
            <div className="card-caption">
              <div className="card-name" style={{ fontSize: 20 }}>
                {item.name}
              </div>
              <div className="card-sub">
                {[sourceLabel, formatDateShort(item.createdAt)].filter(Boolean).join(" · ")}
              </div>
            </div>
          </div>

          {item.note && (
            <div className="sticky-note" style={{ transform: "rotate(-3deg)" }}>
              {item.note}
            </div>
          )}
        </div>

        <div className="detail-info-col">
          <div className="info-tape" style={{ background: tapeColorFor(item.category) }}>
            {item.category}
          </div>
          <h1>{item.name}</h1>
          <div className="detail-meta">
            {[sourceLabel, `adicionado em ${formatDateLong(item.createdAt)}`].filter(Boolean).join(" · ")}
          </div>

          <div className="actions-row">
            <span className="status-pill">{STATUS_LABEL[item.status]}</span>
            {item.link && (
              <a className="btn-ghost" href={item.link} target="_blank" rel="noopener noreferrer">
                ver na loja ↗
              </a>
            )}
          </div>

          <div className="divider" />

          <h2>histórico de preço</h2>
          <p className="tagline" style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 2, marginBottom: 18 }}>
            psst, aqui fica registradinho cada vez que eu pesquisei
          </p>

          <div className="history-list">
            {prices.length === 0 && <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>ainda sem preço registrado.</p>}
            {prices.map((p) => (
              <div key={p.id} className="history-row">
                <div>
                  <div className="history-price">R$ {formatPrice(p.price.toString())}</div>
                  <div className="history-meta">
                    {[formatDateShort(p.researchedAt), p.store].filter(Boolean).join(" · ")}
                  </div>
                </div>
                {lowest && p.id === lowest.id && prices.length > 1 && <span className="history-tag">menor até agora</span>}
              </div>
            ))}
          </div>

          <form action={addPriceWithId} className="price-form">
            <div className="field" style={{ marginTop: 0, flex: "1 1 140px" }}>
              <label htmlFor="price">pesquisei de novo</label>
              <input id="price" name="price" type="text" placeholder="R$ 0,00" required />
            </div>
            <div className="field" style={{ marginTop: 0, flex: "1 1 140px" }}>
              <label htmlFor="store">loja (opcional)</label>
              <input id="store" name="store" type="text" placeholder="ex: zara" />
            </div>
            <button type="submit" className="btn-ghost">
              registrar 🔎
            </button>
          </form>

          <div className="buttons-row">
            {item.status !== "COMPRADO" && (
              <form action={markPurchased}>
                <button type="submit" className="btn-primary">
                  comprei isso! 🎉
                </button>
              </form>
            )}
            {item.status !== "QUERO" && (
              <form action={markWanted}>
                <button type="submit" className="btn-ghost">
                  voltar pra &quot;quero&quot;
                </button>
              </form>
            )}
            {item.status !== "DESISTI" && (
              <form action={markGaveUp}>
                <button type="submit" className="btn-ghost">
                  desisti 💭
                </button>
              </form>
            )}
            <form action={removeItem}>
              <button type="submit" className="btn-ghost">
                excluir
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
