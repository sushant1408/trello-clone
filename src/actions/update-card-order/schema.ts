import { z } from "zod";

export const UpdateCardOrderSchema = z.object({
  boardId: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      listId: z.string(),
      title: z.string(),
      order: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});
