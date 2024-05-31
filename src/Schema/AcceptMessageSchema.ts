import { z } from "zod";

export const AcceptMessageSchema = z.object({
    acceptValue:z.boolean()
})