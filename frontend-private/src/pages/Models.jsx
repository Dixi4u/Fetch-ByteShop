import React, { useState, useEffect } from "react";
import ListModels from "../components/Models/ListModels";
import RegisterModel from "../components/Models/RegisterModel";

const Models = () => {
  const [activeTab, setActiveTab] = useState("list"); // Estado inicial en "list"
  const API = "http://localhost:4000/api/models";
  const [id, setId] = useState("");
  const [nameModel, setNameModel] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener los modelos desde la API
  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch(API);
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los modelos");
      }
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error al obtener los modelos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchModels al cargar la página
  useEffect(() => {
    fetchModels();
  }, []);

  const saveModel = async (e) => {
    e.preventDefault();

    if (!nameModel.trim()) {
      alert("El nombre del modelo no puede estar vacío");
      return;
    }

    // Validar si el nombre ya existe en la lista de modelos
    if (
      models.some(
        (model) =>
          model.name.trim().toLowerCase() === nameModel.trim().toLowerCase()
      )
    ) {
      alert("El nombre del modelo ya existe. Por favor, elige otro.");
      return;
    }

    const newModel = {
      name: nameModel.trim(),
    };

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newModel),
      });

      if (!response.ok) {
        throw new Error("Hubo un error al registrar el modelo");
      }

      const data = await response.json();
      alert("Nuevo modelo registrado exitosamente");
      setModels(data);
      fetchModels();
      setNameModel("");
    } catch (error) {
      console.error("Error al registrar el modelo:", error);
      alert("Error al registrar el modelo");
    }
  };

  const deleteModel = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el modelo");
      }

      alert("Modelo eliminado exitosamente");
      fetchModels();
    } catch (error) {
      console.error("Error al eliminar el modelo:", error);
      alert("Error al eliminar el modelo");
    }
  };

  const updateModel = (model) => {
    setId(model._id);
    setNameModel(model.name);
    setActiveTab("form");
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const editModel = {
        name: nameModel,
      };
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editModel),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el modelo");
      }

      const data = await response.json();
      alert("Modelo actualizado exitosamente");
      setModels(data);
      setId(""); // Limpiar el ID
      fetchModels(); // Volver a cargar la lista
    } catch (error) {
      console.error("Error al editar el modelo:", error);
      alert("Error al editar el modelo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Modelos</h1>
        <div>
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:border-b-2 focus:border-blue-500"
              onClick={() => setActiveTab("list")}
            >
              Lista de modelos
            </button>
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:border-b-2 focus:border-blue-500"
              onClick={() => setActiveTab("form")}
            >
              Gestionar Modelos
            </button>
          </div>
          <div>
            {activeTab === "list" && (
              <ListModels
                models={models}
                loading={loading}
                deleteModel={deleteModel}
                updateModel={updateModel}
              />
            )}
            {activeTab === "form" && (
              <RegisterModel
                setNameModel={setNameModel}
                saveModel={saveModel}
                nameModel={nameModel}
                id={id}
                handleEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;
