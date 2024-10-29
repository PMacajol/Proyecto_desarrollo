"use client";

import React, { useState, useEffect } from "react";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [numeroVenta, setNumeroVenta] = useState("");
  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [nuevaVenta, setNuevaVenta] = useState({
    nombreProducto: "",
    cantidad: "",
    precio: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar todas las ventas
  const cargarVentas = async () => {
    try {
      const response = await fetch("https://localhost:7208/api/venta");
      const data = await response.json();
      setVentas(data);
    } catch (error) {
      setErrorMessage("Error al cargar las ventas");
    }
  };

  // Función para buscar una venta específica
  const buscarVenta = async () => {
    if (!numeroVenta) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7208/api/venta/${numeroVenta}`
      );
      if (!response.ok) throw new Error("Venta no encontrada");
      const data = await response.json();
      setVentaDetalle(data);
    } catch (error) {
      setErrorMessage("Error al buscar la venta");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para crear una nueva venta
  const crearVenta = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7208/api/venta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaVenta),
      });
      if (!response.ok) throw new Error("Error al crear la venta");
      await cargarVentas(); // Refrescar la lista de ventas después de crear
    } catch (error) {
      setErrorMessage("Error al crear la venta");
    }
  };

  // Función para actualizar una venta
  const actualizarVenta = async (id) => {
    try {
      const ventaActualizada = ventas.find((venta) => venta.id === id); // Encuentra la venta a actualizar
      const response = await fetch(`https://localhost:7208/api/venta/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaActualizada),
      });
      if (!response.ok) throw new Error("Error al actualizar la venta");
      await cargarVentas(); // Refrescar la lista de ventas después de actualizar
    } catch (error) {
      setErrorMessage("Error al actualizar la venta");
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Ventas</h1>

      {/* Sección de búsqueda de ventas */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-1">
          Buscar Venta por Número:
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text" // Cambiado a "text" para aceptar valores alfanuméricos
            value={numeroVenta}
            onChange={(e) => setNumeroVenta(e.target.value)}
            className="px-4 py-2 border rounded"
            placeholder="Ingresa el No. de venta"
          />
          <button
            onClick={buscarVenta}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Detalle de venta específica */}
      {ventaDetalle && (
        <div className="mb-6 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold">Detalle de la Venta:</h2>
          <p>
            <strong>ID:</strong> {ventaDetalle.id}
          </p>
          <p>
            <strong>Producto:</strong> {ventaDetalle.nombreProducto}
          </p>
          <p>
            <strong>Cantidad:</strong> {ventaDetalle.cantidad}
          </p>
          <p>
            <strong>Precio:</strong> {ventaDetalle.precio}
          </p>
        </div>
      )}

      {/* Formulario para crear nueva venta */}
      <form onSubmit={crearVenta} className="mb-6 space-y-4">
        <h2 className="text-xl font-semibold">Crear Nueva Venta</h2>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={nuevaVenta.nombreProducto}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, nombreProducto: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={nuevaVenta.cantidad}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevaVenta.precio}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, precio: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Crear Venta
        </button>
      </form>

      {/* Tabla de ventas */}
      <table className="w-full text-left border-t border-b border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Producto</th>
            <th className="px-4 py-2">Cantidad</th>
            <th className="px-4 py-2">Precio</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td className="border px-4 py-2">{venta.id}</td>
              <td className="border px-4 py-2">{venta.nombreProducto}</td>
              <td className="border px-4 py-2">{venta.cantidad}</td>
              <td className="border px-4 py-2">{venta.precio}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => actualizarVenta(venta.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Actualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default Ventas;
