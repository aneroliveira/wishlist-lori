import Link from "next/link";
import { createItem } from "../actions";

const CATEGORIES = ["roupas", "calçados", "beleza", "casa", "eletrônicos", "livros", "outros"];

export default function NovoDesejoPage() {
  return (
    <div className="add-stage">
      <div className="add-backdrop" aria-hidden="true">
        <h1>meus desejos</h1>
        <div className="ghost-row">
          <div className="ghost-card" style={{ background: "linear-gradient(135deg,#fbefe9,#f3d9c8)" }} />
          <div className="ghost-card" style={{ background: "linear-gradient(135deg,#eaf2f4,#d3e3e8)" }} />
          <div className="ghost-card" style={{ background: "linear-gradient(135deg,#fbf2dc,#f3dfa8)" }} />
          <div className="ghost-card" style={{ background: "linear-gradient(135deg,#f1eaf7,#dfcbee)" }} />
        </div>
      </div>
      <div className="scrim" />

      <div className="add-card" aria-label="Adicionar novo desejo">
        <div className="tape" style={{ background: "var(--tape-lilac)", position: "absolute", top: -12, left: 40 }}>
          novo desejo
        </div>
        <h2>pregar no mural</h2>
        <p className="tagline">só o nome já serve, o resto você completa quando quiser</p>

        <form action={createItem}>
          <div className="field">
            <label htmlFor="name">nome do item</label>
            <input id="name" name="name" type="text" required placeholder="ex: blazer alfaiataria bege" />
          </div>

          <div className="field">
            <label htmlFor="link">link do produto</label>
            <input id="link" name="link" type="url" placeholder="https://..." />
          </div>

          <div className="field">
            <label htmlFor="imageUrl">foto (cole o link da imagem)</label>
            <input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="category">categoria</label>
              <select id="category" name="category" defaultValue={CATEGORIES[0]}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="price">preço encontrado</label>
              <input id="price" name="price" type="text" placeholder="R$ 0,00" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="store">loja (opcional)</label>
            <input id="store" name="store" type="text" placeholder="ex: zara, shein, amazon..." />
          </div>

          <div className="field">
            <label htmlFor="note">nota (opcional)</label>
            <textarea id="note" name="note" rows={2} placeholder="um lembrete só seu..." />
          </div>

          <div className="form-actions">
            <Link href="/" className="btn-ghost">
              cancelar
            </Link>
            <button type="submit" className="btn-primary">
              pregar no mural 📌
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
