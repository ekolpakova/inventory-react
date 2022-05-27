import { useEffect, useState } from "react";

const ToDo = () => {
  const [todos, setTodos] = useState([{ name: "Drake" }, { name: "Josh" }]);
  const [todo, setTodo] = useState("");

  console.log(todos);

  useEffect(() => console.log("todos", todos));

  const handleUpdate = (e, i) => {
    e.preventDefault();
    const arr = [...todos];
    arr[i].name = todo;
    setTodos(arr);
    console.log(arr);

    /*console.log(1);
    setTodos((prev) =>
      prev.map((item) => (item.key === key ? { ...item, name: "Jake" } : item))
    );*/
  };

  return (
    <div>
      {todos.map((todo, i) => (
        <>
          <input
            key={i}
            defaultValue={todo.name}
            onChange={(e) => {
              setTodo(e.target.value);
            }}
            onDoubleClick={(e) => {
                handleUpdate(e, i);
            }}
          />
          <input
            type="submit"
            onClick={(e) => {
              handleUpdate(e, i);
            }}
            value="Изменить"
          ></input>
        </>
      ))}
    </div>
  );
};

export default ToDo;
