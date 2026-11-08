"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { parsePrice } from "@/lib/format";
import { ItemStatus } from "@/generated/prisma/client";

const createItemSchema = z.object({
  name: z.string().trim().min(1, "o nome é obrigatório"),
  link: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  category: z.string().trim().min(1).optional(),
  price: z.string().trim().optional(),
  store: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

export async function createItem(formData: FormData): Promise<void> {
  const parsed = createItemSchema.safeParse({
    name: formData.get("name"),
    link: formData.get("link"),
    imageUrl: formData.get("imageUrl"),
    category: formData.get("category"),
    price: formData.get("price"),
    store: formData.get("store"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "dados inválidos");
  }

  const { name, link, imageUrl, category, price, store, note } = parsed.data;
  const priceValue = parsePrice(price);

  await prisma.item.create({
    data: {
      name,
      link: link || null,
      imageUrl: imageUrl || null,
      category: category || "outros",
      note: note || null,
      priceEntries: priceValue
        ? { create: [{ price: priceValue, store: store || null }] }
        : undefined,
    },
  });

  revalidatePath("/");
  redirect("/");
}

export async function addPriceEntry(itemId: string, formData: FormData): Promise<void> {
  const price = parsePrice(formData.get("price")?.toString());
  if (!price) {
    throw new Error("preço inválido");
  }
  const store = formData.get("store")?.toString().trim() || null;

  await prisma.priceEntry.create({
    data: { itemId, price, store },
  });

  revalidatePath(`/item/${itemId}`);
  revalidatePath("/");
}

export async function updateStatus(itemId: string, status: ItemStatus): Promise<void> {
  await prisma.item.update({
    where: { id: itemId },
    data: {
      status,
      purchasedAt: status === ItemStatus.COMPRADO ? new Date() : null,
    },
  });

  revalidatePath(`/item/${itemId}`);
  revalidatePath("/");
}

export async function deleteItem(itemId: string): Promise<void> {
  await prisma.item.delete({ where: { id: itemId } });
  revalidatePath("/");
  redirect("/");
}
