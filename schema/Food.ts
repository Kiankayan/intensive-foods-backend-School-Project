import { z } from "zod";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  categoryId: z.string().min(1, { message: "You must select a category" }),
  numberInStock: z
    .number()
    .min(1, { message: "Stock must be at least 1" })
    .max(100, { message: "Stock cannot exceed 100" }),
  price: z
    .number()
    .min(1, { message: "Price must be at least 1" })
    .max(20, { message: "Price cannot exceed 20" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

type FormData = z.infer<typeof schema>;

export function validate(body: any) {
  return schema.safeParse(body);
}
