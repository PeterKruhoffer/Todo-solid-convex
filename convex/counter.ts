import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query(async (ctx): Promise<number> => {
  const counterDoc = await ctx.db.query("counter").first();
  if (counterDoc === null) {
    return 0;
  }
  return counterDoc.increment;
});

export const increment = mutation({
  args: {
    increment: v.number(),
  },
  handler: async (ctx, args) => {
    let counterDoc = await ctx.db.query("counter").first();
    if (counterDoc === null) {
      await ctx.db.insert("counter", args);
    } else {
      await ctx.db.patch(counterDoc._id, {
        increment: counterDoc.increment + args.increment,
      });
    }
  },
});
