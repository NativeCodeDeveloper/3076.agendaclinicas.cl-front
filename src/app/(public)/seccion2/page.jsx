'use client'

import RevealOnScroll from "@/Componentes/RevealOnScroll";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Seccion2() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [infoData, setInfoData] = useState([]);

  const fallbackServices = [
    {
      id: "srv-1",
      name: "Atención médica general",
      description: "Evaluación integral de salud, orientación profesional y seguimiento.",
      image: "/logoagendaclinica.png",
    },
    {
      id: "srv-2",
      name: "Tratamientos Metabólicos",
      description: "Planes personalizados para la salud a largo plazo.",
      image: "/logoagendaclinica.png",
    },
    {
      id: "srv-3",
      name: "Nutrición Clínica",
      description: "Orientación alimentaria para mejorar tu calidad de vida.",
      image: "/logoagendaclinica.png",
    },
  ];

  const services = infoData.map((item) => ({
    id: item.id_publicacionesTituloDescripcion,
    name: item.publicacionesTitulo,
    description: item.publicacionesDescripcion,
    image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.publicacionesTituloDescripcionImagen}/card`,
  }));

  async function loadServices() {
    try {
      const res = await fetch(`${API}/publicacionesTituloDetalle/seleccionarPublicacionesTituloDetalle`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) return;

      const data = await res.json();
      setInfoData(data);
    } catch {
      console.warn("Could not load original seccion2 data, using fallbacks");
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const content = services.length > 0 ? services : fallbackServices;

  return (
    <section id="servicios" className="scroll-mt-24 bg-slate-50 py-20 text-slate-800 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">

        {/* Header */}
        <RevealOnScroll>
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-10 bg-indigo-600" />
              <span className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
                Servicios
              </span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-slate-600">
              Explora los tratamientos y servicios disponibles en este centro. Agenda tu hora directamente en línea, de forma rápida y sin llamadas.
            </p>
          </div>
        </RevealOnScroll>

        {/* Dynamic Services Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {content.map((service, index) => (
            <RevealOnScroll
              key={service.id ?? index}
              delayClass={index % 3 === 1 ? "delay-100" : index % 3 === 2 ? "delay-200" : ""}
            >
              <article className="relative h-[480px] overflow-hidden rounded-[2.5rem] bg-slate-200 shadow-md group">
                {/* Background Full Image */}
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="transition duration-500 ease-out group-hover:scale-105"
                />

                {/* Gradient overlay for readability and premium look */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />

                {/* Top Right Label for Service Name (if short enough) */}
                <div className="absolute top-6 right-6 rounded-full bg-indigo-600/90 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white shadow-lg max-w-[80%] text-center truncate">
                  {service.name}
                </div>

                {/* Bottom Descriptions since it's a service, they need to see description */}
                <div className="absolute bottom-6 left-[6.5rem] right-6 p-2 pointer-events-none">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-md">{service.name}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{service.description}</p>
                </div>

              </article>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
