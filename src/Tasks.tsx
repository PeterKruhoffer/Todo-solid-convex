import { createSignal, For, Show } from "solid-js";
import { api } from "../convex/_generated/api";
import { createMutation, createQuery } from "./cvxsolid";

export function Tasks() {
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const paginatedTasks = createQuery(api.tasks.get);

  const createTask = createMutation(api.tasks.create);
  const removeTask = createMutation(api.tasks.remove);

  return (
    <main class="grid place-items-center min-h-screen flex-1 w-full p-10">
      <h1 class="text-2xl">Tasks page here!</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createTask({
            title: title(),
            description: description(),
            isCompleted: false,
          });
        }}
        class="grid place-items-center gap-8 w-full"
      >
        <input
          type="text"
          name="title"
          required
          placeholder="Title of task"
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
          class="p-2 shadow-inner ring ring-slate-300 w-1/2"
        />
        <input
          type="text"
          name="description"
          placeholder="Description of task"
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
          class="p-2 shadow-inner ring ring-slate-300 w-1/2"
        />
        <button type="submit" class="border px-2 py-1">
          Create
        </button>
      </form>
      <Show when={paginatedTasks()}>
        {(pt) => (
          <div class="grid grid-cols-4 gap-8 w-full">
            <For each={pt().page}>
              {(task) => (
                <div class="p-4 border grid place-items-start">
                  <span>{task.title}</span>
                  <span>{task?.description}</span>
                  <span>
                    {task.isCompleted ? "Is completed" : "Is not completed"}
                  </span>
                  <button
                    onClick={() => removeTask({ id: task._id! })}
                    class="border px-2 py-1"
                  >
                    Remove Task
                  </button>
                </div>
              )}
            </For>
          </div>
        )}
      </Show>
    </main>
  );
}
