import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const messages = ["Heelo", "Hi there!"];

export const postRouter = createTRPCRouter({
  ping: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      const date = new Date().toLocaleTimeString();
      return {
        greeting: `Ping: ${input.text}. Server-side connection OK at: ${date}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getLiveChatMessages: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "welcome to chatm3";
  }),

  getChatMessages: protectedProcedure.query(() => {
    return messages;
  }),
});
