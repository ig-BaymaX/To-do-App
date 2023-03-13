import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import { AiOutlinePlus } from "react-icons/ai";
import Todo from "./Todo";
import { db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#800080] to-[#DC381F]`,
  container: `bg-slate-100 max-w-[500 px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-4xl text-black font-extrabold text-center p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl rounded-md`,
  button: `hover:scale-110 border p-4 ml-2 bg-gradient-to-r from-[#800080] to-[#DC381F] rounded-md text-white`,
  count: `text-center font-semibold text-2xl p-2`,
  sections: `flex justify-between`,
  button1: `hover:scale-110 border my-3 p-2 w-[260px] rounded-md text-xl font-bold bg-gradient-to-l from-[#A74AC7] to-[#00CED1] `,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Create TODO
  const createTodo = async (e) => {
    e.preventDefault(e);
    let text_box = document.querySelector(".text-box");
    if (text_box.value === "") {
      alert("Please enter a valid todo");
      return;
    }
    await addDoc(collection(db, "todos"), {
      date: moment(new Date()).format("DD-MM-YYYY (dddd), h:mm:ss a"),
      text: input,
      completed: false,
    });
    setInput("");
  };
  // Read TODO from firebase
  const fetchData = (mode) => {
    const q1 = query(collection(db, "todos"));

    const unsubscribe = onSnapshot(q1, (querySnapshot) => {
      let todosArr = [];

      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        todosArr.push({ ...doc.data(), id: doc.id });
      });

      if (mode === 1) setTodos(todosArr);
      else if (mode === 2) setTodos(todosArr.filter((todo) => !todo.completed));
      else setTodos(todosArr.filter((todo) => todo.completed));
    });

    return () => unsubscribe();
  };

  const allTodos = () => {
    document.querySelector(".allbtn").classList.remove("enabled:opacity-50");
    document.querySelector(".allbtn").classList.add("enabled:opacity-100");
    document
      .querySelector(".activebtn")
      .classList.remove("enabled:opacity-100");
    document.querySelector(".activebtn").classList.add("enabled:opacity-50");
    document.querySelector(".compbtn").classList.remove("enabled:opacity-100");
    document.querySelector(".compbtn").classList.add("enabled:opacity-50");
    fetchData(1);
  };

  const activeTodos = () => {
    document.querySelector(".activebtn").classList.remove("enabled:opacity-50");
    document.querySelector(".activebtn").classList.add("enabled:opacity-100");
    document.querySelector(".allbtn").classList.remove("enabled:opacity-100");
    document.querySelector(".allbtn").classList.add("enabled:opacity-50");
    document.querySelector(".compbtn").classList.remove("enabled:opacity-100");
    document.querySelector(".compbtn").classList.add("enabled:opacity-50");
    fetchData(2);
  };

  const completedTodos = () => {
    document.querySelector(".compbtn").classList.remove("enabled:opacity-50");
    document.querySelector(".compbtn").classList.add("enabled:opacity-100");
    document.querySelector(".allbtn").classList.remove("enabled:opacity-100");
    document.querySelector(".allbtn").classList.add("enabled:opacity-50");
    document
      .querySelector(".activebtn")
      .classList.remove("enabled:opacity-100");
    document.querySelector(".activebtn").classList.add("enabled:opacity-50");
    fetchData(3);
  };

  // Update TODO from firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  // Edit TODO
  const editTodo = async (id) => {
    const newTodo = prompt("Enter new todo");
    if (newTodo === "") {
      alert("Please enter a valid todo");
      return;
    }
    await updateDoc(doc(db, "todos", id), {
      text: newTodo,
      date: moment(new Date()).format("DD-MM-YYYY (dddd), h:mm:ss a"),
    });
  };

  // Delete TODO
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  useEffect(() => {
    allTodos();
  }, []);

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>To-Do App</h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`${style.input} text-box`}
            type="text"
            placeholder="Add a To-do"
          />
          <button className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        {todos.length > 0 && (
          <ul>
            {todos?.map(
              (todo, index) => (
                console.log(todo),
                (
                  <Todo
                    key={index}
                    todo={todo}
                    toggleComplete={toggleComplete}
                    editTodo={editTodo}
                    deleteTodo={deleteTodo}
                  />
                )
              )
            )}
          </ul>
        )}

        {todos.length < 1 ? null : todos.length == 1 ? (
          <p className={style.count}>{`You have ${todos.length} Todo`}</p>
        ) : (
          <p className={style.count}>{`You have ${todos.length} Todos`}</p>
        )}
        <div className={style.sections}>
          <button className={`${style.button1} allbtn`} onClick={allTodos}>
            All
          </button>
          <button
            className={`${style.button1} focus:outline-none enabled:opacity-100 activebtn`}
            onClick={activeTodos}
          >
            Active
          </button>
          <button
            className={`${style.button1} focus:outline-none enabled:opacity-100 compbtn`}
            onClick={completedTodos}
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
