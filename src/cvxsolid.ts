/*
 *
 * This file is from https://github.com/jamwt/solid-convex
 * Jamie also has a great walktrough of the first version here https://www.youtube.com/watch?v=5Gck3MsGl5Y
 *
 * The rest is from the react convex package and the convex-svelte one
 */

import type { ConvexClient } from "convex/browser";
import type {
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
} from "convex/server";
import { type Context, createContext, from, useContext } from "solid-js";

export const ConvexContext: Context<ConvexClient | undefined> = createContext();

export type EmptyObject = Record<string, never>;

export type OptionalRestArgsOrSkip<FuncRef extends FunctionReference<any>> =
  FuncRef["_args"] extends EmptyObject
    ? [args?: EmptyObject | "skip"]
    : [args: FuncRef["_args"] | "skip"];

// Create a reactive SolidJS atom attached to a Convex query function.
export function createQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgsOrSkip<Query>
): () => Query["_returnType"] | undefined {
  const convex = useContext(ConvexContext);
  if (convex === undefined) {
    throw "No convex context";
  }
  const [first] = args;
  return from((setter) => {
    const unsubber = convex.onUpdate(query, first, setter);
    return unsubber;
  });
}

export interface SolidMutation<Mutation extends FunctionReference<"mutation">> {
  /**
   * Execute the mutation on the server, returning a `Promise` of its return value.
   *
   * @param args - Arguments for the mutation to pass up to the server.
   * @returns The return value of the server-side function call.
   */
  (...args: OptionalRestArgs<Mutation>): Promise<FunctionReturnType<Mutation>>;

  /**
   * Define an optimistic update to apply as part of this mutation.
   *
   * This is a temporary update to the local query results to facilitate a
   * fast, interactive UI. It enables query results to update before a mutation
   * executed on the server.
   *
   * When the mutation is invoked, the optimistic update will be applied.
   *
   * Optimistic updates can also be used to temporarily remove queries from the
   * client and create loading experiences until a mutation completes and the
   * new query results are synced.
   *
   * The update will be automatically rolled back when the mutation is fully
   * completed and queries have been updated.
   *
   * @param optimisticUpdate - The optimistic update to apply.
   * @returns A new `ReactMutation` with the update configured.
   *
   * @public
   */

  /* withOptimisticUpdate<T extends OptimisticUpdate<FunctionArgs<Mutation>>>(
    optimisticUpdate: T &
      (ReturnType<T> extends Promise<any>
        ? "Optimistic update handlers must be synchronous"
        : {}),
  ): SolidMutation<Mutation>; */
}

export function createMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): (args?: Mutation["_args"]) => Promise<Mutation["_returnType"]> {
  const convex = useContext(ConvexContext);
  if (convex === undefined) {
    throw "No convex context";
  }

  return (args) => {
    let fullArgs = args ?? {};
    return convex.mutation(mutation, fullArgs);
  };
}

export function createAction<T>(
  action: FunctionReference<"action">,
): (args?: {}) => Promise<T> {
  const convex = useContext(ConvexContext);
  if (convex === undefined) {
    throw "No convex context";
  }
  return (args) => {
    let fullArgs = args ?? {};
    return convex.action(action, fullArgs);
  };
}
