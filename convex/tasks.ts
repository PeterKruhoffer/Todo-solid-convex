import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").paginate({
      cursor: null,
      numItems: 25,
    });
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", args);
  },
});

export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
