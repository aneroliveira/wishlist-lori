import Link from "next/link";
import Image from "next/image";
import type { Item, PriceEntry } from "@/generated/prisma/client";
import { tapeColorFor, rotationFor } from "@/lib/visual";
import { formatPrice, formatDateShort, hostnameOf } from "@/lib/format";
import { PhotoPlaceholderIcon } from "./icons";

type ItemWithPrices = Item & { priceEntries: PriceEntry[] };

export function ItemCard({ item }: { item: ItemWithPrices }) {
  const latest = item.priceEntries[0];
  const previous = item.priceEntries[1];
  const sourceLabel = item.link ? hostnameOf(item.link) : null;

  return (
    <Link
      href={`/item/${item.id}`}
      className="card"
      style={{ transform: rotationFor(item.id) }}
      aria-label={`Ver detalhes de ${item.name}`}
    >
      <div className="tape" style={{ background: tapeColorFor(item.category) }}>
        {item.category}
      </div>
      <div className="card-photo">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 560px) 90vw, (max-width: 1060px) 40vw, 20vw"
          />
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
        {latest && (
          <div className="price-badge">
            <div className="price-now">R$ {formatPrice(latest.price.toString())}</div>
            {previous && Number(previous.price.toString()) !== Number(latest.price.toString()) && (
              <div className="price-was">antes R$ {formatPrice(previous.price.toString())}</div>
            )}
          </div>
        )}
      </div>
      <div className="card-caption">
        <div className="card-name">{item.name}</div>
        <div className="card-sub">
          {[sourceLabel, formatDateShort(item.createdAt)].filter(Boolean).join(" · ")}
        </div>
      </div>
    </Link>
  );
}
