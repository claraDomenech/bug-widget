import { useState } from "react";

export default function Formulario() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Manejar selección de imagen y generar previsualización
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.onerror = () => setError("Error al leer la imagen");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageBase64 = null;
      let imageName = null;

      // Convertir imagen a Base64 si hay
      if (imageFile) {
        imageName = imageFile.name;
        const reader = new FileReader();

        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(",")[1]); // Solo Base64
          reader.onerror = () => reject(new Error("Error leyendo la imagen"));
          reader.readAsDataURL(imageFile);
        });
      }

      const body = { description, imageBase64, imageName };
      console.log("Body que se enviará a Netlify:", body);

      // Llamada a Netlify Function
      const res = await fetch("/.netlify/functions/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Manejar respuesta no JSON
      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(`Respuesta del servidor no es JSON: ${text}`);
      }

      console.log("Respuesta del server:", data);

      if (!res.ok) throw new Error(data.error || "Error al enviar el formulario");

      setSuccess(data.message || "Tarea creada correctamente");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Formulario</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="imagen">Subir imagen:</label>
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <div>
            <p>Previsualización:</p>
            <img
              src={imagePreview}
              alt="Previsualización"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </>
  );
}
