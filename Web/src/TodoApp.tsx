import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
  id: number;
  task: string;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>('http://localhost:3000/todos'); // Endret til 3000
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!task) return;
    try {
      const response = await axios.post<Todo>('http://localhost:3000/todos', { task }); // Endret til 3000
      setTodos([...todos, response.data]);
      setTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`); // Endret til 3000
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error removing todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="border border-gray-300 p-2 rounded mr-2"
      />
      <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded">
        Legg til todo
      </button>
      <ul className="mt-4">
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center">
            <span>{todo.task}</span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Fjern
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
