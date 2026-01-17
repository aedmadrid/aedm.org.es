import React, { useEffect, useState } from "react";
import { HClick } from "../components/HClick";

type Project = {
  pageId: string;
  name: string;
};

export const Proyectos: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://api.aedm.org.es/PROYECTOS_DB.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data: Project[]) => {
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching data:", err);
          setError("No se pudieron cargar los proyectos.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>Proyectos</h1>

      {loading && <p>Cargando proyectos…</p>}
      {error && <p>{error}</p>}

      {projects.map((project) => (
        <HClick
          key={project.pageId}
          texto={project.name}
          enlace={`/id/${project.pageId}`}
          icono="arrow_forward"
        />
      ))}
    </main>
  );
};
