import { createSignal, For, Show } from "solid-js";
import { api } from "../convex/_generated/api";
import { createMutation, createQuery } from "./cvxsolid";
import { Id } from "../convex/_generated/dataModel";

export function Tasks() {
  const paginatedTasks = createQuery(api.tasks.get);

  return (
    <main class="grid place-items-center min-h-screen flex-1 w-full p-10">
      <div class="w-full">
        <h1 class="text-2xl">Tasks page</h1>
        <AddTaskForm />
      </div>

      <Show when={paginatedTasks()}>
        {(pt) => (
          <div class="grid grid-cols-4 gap-8 w-full">
            <For each={pt().page}>{(task) => <TaskCard task={task} />}</For>
          </div>
        )}
      </Show>
    </main>
  );
}

type TaskCardProps = {
  task: {
    title: string;
    description?: string;
    isCompleted: boolean;
    _id: Id<"tasks">;
  };
};
function TaskCard(props: TaskCardProps) {
  const removeTask = createMutation(api.tasks.remove);
  return (
    <div class="p-4 ring-1 ring-slate-300 grid place-items-start">
      <span>{props.task.title}</span>
      <span>{props?.task.description}</span>
      <span>
        {props.task.isCompleted ? "Is completed" : "Is not completed"}
      </span>
      <div class="grid grid-flow-col auto-cols-auto gap-x-4 w-full">
        <button
          //onClick={() => removeTask({ id: props.task._id! })}
          class="ring-1 ring-slate-300 px-3 py-1"
        >
          Complete Task
        </button>
        <button
          onClick={() => removeTask({ id: props.task._id! })}
          class="ring-1 ring-slate-300 px-3 py-1"
        >
          Remove Task
        </button>
      </div>
    </div>
  );
}

function AddTaskForm() {
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const createTask = createMutation(api.tasks.create);

  let titleInputRef: HTMLInputElement | undefined;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await createTask({
          title: title(),
          description: description(),
          isCompleted: false,
        });

        setTitle("");
        setDescription("");
        titleInputRef?.focus();
      }}
      class="grid place-items-center gap-8 w-full p-8"
    >
      <input
        ref={titleInputRef}
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
      <button
        type="submit"
        class="ring-1 ring-slate-400 px-3 py-1 active:scale-95"
      >
        Create
      </button>
    </form>
  );
}
