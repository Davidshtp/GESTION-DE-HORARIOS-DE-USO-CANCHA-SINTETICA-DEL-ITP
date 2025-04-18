import salir from "../assets/images/salir.png";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Reportes() {
    const history = useNavigate();
    const [identificacion, setIdentificacion] = useState('');
    const [format, setFormat] = useState('excel');
    const [error, setError] = useState('');

   
    


    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
                setIdentificacion('');
                setFormat('excel');
            }, 2000);


            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleDownload = async (e) => {
        e.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

        // Validar que la identificación no esté vacía
        if (!identificacion) {
            setError("Por favor, ingresa una identificación.");
            return;
        }

        try {
            const token = localStorage.getItem("token"); // Obtener el token
            const response = await axios.get(`https://localhost:3001/api/reservas/usuario/${identificacion}`, {
                params: { format },
                responseType: 'blob', // Para manejar la descarga de archivos
                headers: {
                    Authorization: `Bearer ${token}` // Incluir el token en la petición
                }
            });

            if (response.status === 200) {
                // Verificar el tipo de contenido de la respuesta
                const contentType = response.headers['content-type'];

                if (contentType.includes('application/json')) {
                    // Si es JSON, es un mensaje de error
                    const reader = new FileReader();
                    reader.onload = () => {
                        const data = JSON.parse(reader.result);
                        setError(data.message || "Error desconocido.");
                    };
                    reader.readAsText(response.data);
                } else {
                    // Si no es JSON, es un archivo para descargar
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `ReservasUsuario.${format}`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    setError('');
                    setTimeout(() => {
                        setIdentificacion('');
                        setFormat('excel');
                    }, 2000);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError(error.response.data.message || "El usuario no existe o no tiene reservas.");
            } else {
                setError("Error en el servidor. Inténtelo de nuevo más tarde.");
            }
        }
    };

    return (
        <div className="h-screen w-full flex justify-center items-center">
            <div className="bg-white shadow-2xl rounded-lg w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 p-6">
                <div className="flex items-center justify-between mb-6">
                    <img
                        src={salir}
                        alt="Imagen de salir"
                        className="w-8 h-8 hover:scale-110 transition-transform duration-300 cursor-pointer"
                        onClick={() => history("/home")}
                    />
                    <h1 className="text-3xl font-bold text-black-600">Reporte de Reservas</h1>
                </div>
                <form onSubmit={handleDownload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Identificación del Usuario:</label>
                        <input
                            type="text"
                            value={identificacion}
                            onChange={(e) => setIdentificacion(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Formato del Reporte:</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="excel">Excel</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Descargar Reporte
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
}