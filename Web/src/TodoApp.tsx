import { useEffect, useState } from "react";
import axios from "axios";


interface Todo {
  id: number;
  task: string;
}
// axios instantie

const api = axios.create({
  baseURL: `${import.meta.env.VITE_Server_IP}:${import.meta.env.VITE_Server_PORT}`,
});

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await api.get<Todo[]>("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!task.trim()) return;

    try {
      const res = await api.post<Todo>("/todos", { task });
      setTodos((prev) => [...(prev ?? []), res.data]);
      setTask("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((prev) => (prev ?? []).filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error removing todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return <p className="text-center mt-6">Laster...</p>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo App</h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Skriv en todo..."
          className="border border-gray-300 p-2 rounded flex-grow"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
        >
          Legg til
        </button>
      </div>

      <ul className="mt-6 space-y-2">
        {Array.isArray(todos) && todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
          >
            <span>{todo.task}</span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Fjern
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
