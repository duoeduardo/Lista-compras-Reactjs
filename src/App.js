import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return[]
  }
}

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      //mostrar Alerta
      //setAlert({show:true, msg:'Por favor ingresar un valor', type:'danger'})
      showAlert(true, "danger", "Por favor ingresar un valor");
    } else if (name && isEditing) {
      //Manejar Editar
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }

          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true,'success', 'Articulo Editado')
    } else {
      // Mostrar alerta
      showAlert(true, "success", "Objeto agregado a la lista");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  //Muestra alerta
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  //Limpia lista de articulos
  const clearList = () => {
    showAlert(true, "danger", "Lista limpiada");
    setList([]);
  };

  //Elimina articulo de la lista
  const removeItem = (id) => {
    showAlert(true, "danger", "Articulo eliminado");
    setList(list.filter((item) => item.id !== id));
  };

  //Edita articulo de la lista
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
localStorage.setItem('list',JSON.stringify(list))
  },[list])

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Lista de compras</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.j Huevos"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Editar" : "Enviar"}
          </button>
        </div>
      </form>

      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Limpiar
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
