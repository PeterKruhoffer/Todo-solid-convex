import { createSignal, type Component } from "solid-js";
import { createMutation, createQuery } from "./cvxsolid";
import { api } from "../convex/_generated/api";

const App: Component = () => {
  const [count, setCount] = createSignal(0);
  const convexCount = createQuery<number>(api.counter.get);
  const incrementGlobalCount = createMutation<{ increment: number }, void>(
    api.counter.increment,
  );

  return (
    <div class="flex flex-col gap-4 justify-center">
      <p class="text-4xl text-green-700 text-center py-20">
        The current local count is: {count()}
      </p>
      <p class="text-4xl text-green-700 text-center py-20">
        The current global count is: {convexCount()}
      </p>
      <button class="border p-2" onClick={() => setCount(count() + 1)}>
        Increment local count
      </button>
      <button
        class="border p-2"
        onClick={() => incrementGlobalCount({ increment: 2 })}
      >
        Increment global count
      </button>
    </div>
  );
};

export default App;
