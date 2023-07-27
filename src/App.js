import "./App.css";

import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);

      setTodos(res);
    };

    loadData();
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    const todoData = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos",
      {
        method: "POST",
        body: JSON.stringify(todoData),
        headers: {
          "Content-Type": "application/json",
        },
      });

    console.log(todoData);

    setTodos((prevState) => [...prevState, todoData]);
    setTitle('');
    setTime('');
  };

  const handelDelete = async (id) => {

    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }

  const handleEdit = async (todoData) => {
    todoData.done = !todoData.done;

    const data = await fetch(API + "/todos/" + todoData.id, {
      method: "PUT",
      body: JSON.stringify(todoData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  }

  if (loading) {
    return <p>Carregando Pagina...</p>;
  }

  return (
    <div className="App">
      <nav class="navbar navbar-expand-lg">
        <div class="container-md d-flex justify-content-center text-center">
          <a class="navbar-brand fw-bold fs-1" href="#">To-do List</a>
        </div>
      </nav>

      <div className="container">
        <div className="bg-todo-color d-felx justify-content-center align-items-center text-center w-50 mx-auto p-5">
          <div className="todo-header">

            <hr className="" />
          </div>

          <div className="form-todo">
            <form className="" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="title"
                  id="inputTitle"
                  placeholder="Titulo da Tarefa"
                  className="form-control"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                  required
                />
                <label htmlFor="inputTitle">Oque você vai fazer?</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="time"
                  id="inputTime"
                  placeholder="Tempo estimado (em horas)"
                  className="form-control"
                  onChange={(e) => setTime(e.target.value)}
                  value={time || ""}
                  required
                />
                <label htmlFor="inputTime">Duração:</label>
              </div>

              <div className="form-floating">
                <textarea className="form-control" placeholder="Escreva um comentario" id="TextareaComment"></textarea>
                {/* style="height: 100px" */}
                <label for="TextareaComment">Comentario</label>
              </div>

              <button className="btn btn-success my-4 bg-button-addTodo" type="submit" value="Criar Tarefa">
                Criar Tarefa
              </button>
            </form>
          </div>

          <hr class="border border-primary border-3 opacity-75" />

          <div className="list-todo">
          <h2>Lista de Tarefas</h2>
          <hr class="border border-primary border-3 opacity-75" />
            
            {todos.length === 0 && <p>Não há Tarefas!</p>}
            {todos.map((todo) => (
              <div className="todo" key={todo.id}>
                <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
                <p>Duração: {todo.time}</p>
                <div className="">
                  <span onClick={() => handleEdit(todo)}>{!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}</span>

                  <BsTrash onClick={() => handelDelete(todo.id)} />

                </div>

                <hr class="border border-danger border-2 opacity-50"/>

              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
