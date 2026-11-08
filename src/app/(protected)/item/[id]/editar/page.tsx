import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateItem } from "../../../actions";

const CATEGORIES = ["roupas", "calçados", "beleza", "casa", "eletrônicos", "livros", "outros"];

export default async function EditarItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) {
    notFound();
  }

  const updateWithId = updateItem.bind(null, item.id);
  const categoryOptions = CATEGORIES.includes(item.category) ? CATEGORIES : [item.category, ...CATEGORIES];

  return (
    <div className="add-stage">
      <div className="scrim" />

      <div className="add-card" aria-label="Editar desejo">
        <div className="tape" style={{ background: "var(--tape-lilac)", position: "absolute", top: -12, left: 40 }}>
          editar
        </div>
        <h2>ajustar esse desejo</h2>
        <p className="tagline">muda o que precisar, histórico e notas ficam como estão</p>

        <form action={updateWithId}>
          <div className="field">
            <label htmlFor="name">nome do item</label>
            <input id="name" name="name" type="text" required defaultValue={item.name} />
          </div>

          <div className="field">
            <label htmlFor="link">link do produto</label>
            <input id="link" name="link" type="url" placeholder="https://..." defaultValue={item.link ?? ""} />
          </div>

          <div className="field">
            <label htmlFor="imageUrl">foto (cole o link da imagem)</label>
            <input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." defaultValue={item.imageUrl ?? ""} />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="category">categoria</label>
              <select id="category" name="category" defaultValue={item.category}>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Link href={`/item/${item.id}`} className="btn-ghost">
              cancelar
            </Link>
            <button type="submit" className="btn-primary">
              salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
