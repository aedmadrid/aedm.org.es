import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HashtagScroller } from "../components/HashtagScroller";

// Types
interface Vendor {
  id: string;
  mesa: string;
  nombre: string;
  descripcion: string;
  instagram?: string[];
  hashtags: string[];
  pos: [number, number];
  label: string;
  seccion: string;
}

// Vendor data with map positions
const vendors: Vendor[] = [
  {
    id: "mesa1",
    mesa: "Mesa 1",
    nombre: "Malena Valencia y Mar Frontan",
    descripcion:
      "Vendemos cajas sorpresa, charms, amigurumis, prints y accesorios.",
    instagram: ["@malenavgart", "@martiistica"],
    hashtags: ["#charms", "#blindbox", "#amigurumi", "#print", "#accesorios"],
    pos: [1350, 600],
    label: "1",
    seccion: "tb1",
  },
  {
    id: "mesa2a",
    mesa: "Mesa 2A",
    nombre: "Claudia Segovia",
    descripcion: "Venta de pendientes hechos con hojas naturales y resina.",
    hashtags: ["#pendientes"],
    pos: [1050, 85],
    label: "2A",
    seccion: "tb2a",
  },
  {
    id: "mesa2b",
    mesa: "Mesa 2B",
    nombre: "Carmen",
    descripcion: "Diferentes gustos personales míos puestos en común.",
    instagram: ["@c.valverdeart"],
    hashtags: ["#pegatinas", "#furby"],
    pos: [950, 85],
    label: "2B",
    seccion: "tb2b",
  },
  {
    id: "mesa3a",
    mesa: "Mesa 3A",
    nombre: "Julicalifei",
    descripcion:
      "Me gusta crear de forma artesanal y todo lo que vendo siempre está hecho a mano. Llevo tanto fanzines de diversos temas, pegatinas, chapas de fanarts, algunas ilustraciones y grabados originales, cuadros de flores secas... así como accesorios como llaveros de resina y de crochet.",
    instagram: ["@julicalifei"],
    hashtags: [
      "#fanzine",
      "#pegatinas",
      "#grabados",
      "#chapas",
      "#fanart",
      "#prints",
      "#crochet",
      "#ilustración",
      "#llaveros",
      "#encuadernación",
      "#cuadernos",
    ],
    pos: [600, 85],
    label: "3A",
    seccion: "tb3a",
  },
  {
    id: "mesa3b",
    mesa: "Mesa 3B",
    nombre: "Sofia Guzman",
    descripcion:
      "Vendo ilustraciones, pegatinas, fanzines y hasta camisetas hechas con lejía a mano. Soy una ilustradora y diseñadora que proclama el uso artesanal de las cosas, nada realizado con inteligencia artesanal, reflejar que el arte es práctica, pasión y constancia.",
    instagram: ["@ssophifia"],
    hashtags: [
      "#ilustraciones",
      "#pegatinas",
      "#láminas",
      "#prints",
      "#fanzine",
      "#diy",
      "#camisetaspersonalizadas",
      "#camisetasconlejía",
    ],
    pos: [460, 85],
    label: "3B",
    seccion: "tb3b",
  },
  {
    id: "mesa4",
    mesa: "Mesa 4",
    nombre: "Lucía Gama",
    descripcion:
      "Mayormente todo lo que hago son diversos productos de ilustración y pequeños objetos de artesanía como imanes y pendientes de arcilla. También llevo algunas obras originales de grabado e ilustración.",
    instagram: ["@heliannae"],
    hashtags: [
      "#ilustración",
      "#prints",
      "#pegatinas",
      "#pendientes",
      "#imanes",
      "#marcapáginas",
      "#postales",
      "#fanzines",
      "#grabados",
    ],
    pos: [380, 260],
    label: "4",
    seccion: "tb4",
  },
  {
    id: "mesa5a",
    mesa: "Mesa 5A",
    nombre: "Eva M.",
    descripcion:
      "Me gustaría vender amigurumis tematizados de las distintas especialidades y posiblemente acompañarlo de pegatinas y llaveros de la misma temática. También me gustaría plantear el crear accesorios y elementos decorativos tejido todo a crochet.",
    instagram: ["@e.m_desing_"],
    hashtags: ["#amigurumis", "#crochet", "#llaveros", "#llaverossorpresa"],
    pos: [800, 450],
    label: "5A",
    seccion: "tb5a",
  },
  {
    id: "mesa5b",
    mesa: "Mesa 5B",
    nombre: "UVARTTE",
    descripcion:
      "Pegatinas, ilustraciones y llaveros divertidos dibujados y diseñados por mi.",
    instagram: ["@uvartte"],
    hashtags: ["#pegatinas", "#ilustración", "#llaveros"],
    pos: [640, 450],
    label: "5B",
    seccion: "tb5b",
  },
  {
    id: "mesa6",
    mesa: "Mesa 6",
    nombre: "Vega de Navascués",
    descripcion:
      "Venta de piezas de joyería de autor, realizadas de forma artesanal con materiales nobles como plata y piedras preciosas.",
    instagram: ["@vegadenavascues"],
    hashtags: ["#joyería", "#artesanal", "#joyeríaenplata", "#accesorio"],
    pos: [950, 540],
    label: "6",
    seccion: "tb6",
  },
  {
    id: "mesa7",
    mesa: "Mesa 7",
    nombre: "Sara Ortiz y Graphic Cardo",
    descripcion:
      "Vendo camisetas/sudaderas serigrafiadas con uno de mis diseños, además de prints en papel con la misma ilustración. También tengo otros prints, pegatinas y algunas unidades de uno de mis fanzines.",
    instagram: ["@demonspirale", "@graphic.cardo"],
    hashtags: [
      "#pegatinas",
      "#fanzine",
      "#hoodie",
      "#serigrafía",
      "#prints",
      "#camisetaspersonalizadas",
      "#albumilustrado",
    ],
    pos: [1020, 750],
    label: "7",
    seccion: "tb7",
  },
  {
    id: "mesa8a",
    mesa: "Mesa 8A",
    nombre: "Martuki",
    descripcion:
      "Desde hace unos años me modifico la ropa a mi manera mediante la decoloración o añadiendo pintura apta para la ropa. Hago distintos dibujos, de distinto tamaño y con distinta temática en ropa negra u oscura. También me hago a mi misma pendientes y collares con madera.",
    instagram: ["@aropacamiseta"],
    hashtags: [
      "#ropa",
      "#decoloración",
      "#handmade",
      "#joyas",
      "#pendientes",
      "#collares",
      "#madera",
      "#color",
    ],
    pos: [1020, 1050],
    label: "8A",
    seccion: "tb8a",
  },
  {
    id: "mesa8b",
    mesa: "Mesa 8B",
    nombre: "Blanca Benito",
    descripcion:
      "Joyería artesanal de aluminio. Pendientes, collares, anillos, marcapáginas.",
    instagram: ["@blancabenitods", "@missblanchejewels"],
    hashtags: ["#joyas", "#artesanía", "#aluminio", "#joyasaluminio"],
    pos: [1020, 1160],
    label: "8B",
    seccion: "tb8b",
  },
  {
    id: "mesa9a",
    mesa: "Mesa 9A",
    nombre: "Marina Sabio",
    descripcion:
      "Venta de unas 10-15 piezas de cerámica y porcelana hechas a mano.",
    hashtags: ["#ceramica", "#handmade", "#artesanal"],
    pos: [1260, 1480],
    label: "9A",
    seccion: "tb9a",
  },
  {
    id: "mesa9b",
    mesa: "Mesa 9B",
    nombre: "Patricia García",
    descripcion:
      "La propuesta serían por un lado pegatinas y láminas de ilustraciones (algunos fanarts y otros ilustraciones propias) y unos fanzines de fotografías analógicas de paisaje.",
    instagram: ["@rani3_draws"],
    hashtags: ["#pegatinas", "#ilustracion", "#fanzine", "#fotografia"],
    pos: [1090, 1480],
    label: "9B",
    seccion: "tb9b",
  },
  {
    id: "mesa10",
    mesa: "Mesa 10",
    nombre: "inés",
    descripcion:
      "Los productos que hago están basados en el concepto de la personalización, por eso hago llaveros personalizables y peluches que se pueden llevar en el bolso, llaves, pantalón... También hago pegatinas para que la gente decore sus objetos personales a su gusto.",
    hashtags: ["#pegatinas", "#peluches", "#llaveros"],
    pos: [950, 1480],
    label: "10",
    seccion: "tb10",
  },
  {
    id: "mesa11",
    mesa: "Mesa 11",
    nombre: "Ctdart_",
    descripcion:
      "Realizo objetos hechos a mano, como camisetas, joyeros y las propias joyas con arcilla polimérica. También realizo ilustraciones y stickers.",
    instagram: ["@ctdart_"],
    hashtags: ["#camisetaspersonalizadas", "#ilustración", "#joyas"],
    pos: [720, 1480],
    label: "11",
    seccion: "tb11",
  },
  {
    id: "mesa12",
    mesa: "Mesa 12",
    nombre: "Celia",
    descripcion:
      "Vendo pegatinas con ilustraciones digitales, bolsos y fundas de libro cosidos a mano, cuadernos encuadernados artesanalmente, además de llaveros, collares y pendientes.",
    hashtags: ["#pegatinas", "#bolsos", "#bisutería", "#cuadernos"],
    pos: [570, 1630],
    label: "12",
    seccion: "tb12",
  },
  {
    id: "mesa13",
    mesa: "Mesa 13",
    nombre: "dissaraemv",
    descripcion:
      "Prendas de arriba como tops o camisas, de abajo; faldas, pantalones y algo de joyería como collares y brazaletes.",
    instagram: ["@dissaraemv_"],
    hashtags: ["#ropa", "#prendas", "#joyeria"],
    pos: [720, 1910],
    label: "13",
    seccion: "tb13",
  },
  {
    id: "mesa14",
    mesa: "Mesa 14",
    nombre: "Lopo",
    descripcion:
      "Venderé accesorios, piezas y parches hechos por upcycling. Todo con material reciclado y reaprovechado.",
    instagram: ["@L0p0"],
    hashtags: [
      "#charms",
      "#parches",
      "#upcycling",
      "#accesorios",
      "#pantalones",
    ],
    pos: [950, 1910],
    label: "14",
    seccion: "tb14",
  },
];

// All hashtags for the scroll
const allHashtagsRow1 = [
  "#charms",
  "#blindbox",
  "#amigurumi",
  "#print",
  "#accesorios",
  "#pendientes",
  "#fanzine",
  "#pegatinas",
  "#grabados",
  "#chapas",
  "#fanart",
  "#prints",
  "#crochet",
  "#ilustración",
  "#llaveros",
  "#encuadernación",
  "#cuadernos",
];

const allHashtagsRow2 = [
  "#ilustraciones",
  "#láminas",
  "#diy",
  "#camisetaspersonalizadas",
  "#camisetasconlejía",
  "#imanes",
  "#marcapáginas",
  "#postales",
  "#fanzines",
  "#amigurumis",
  "#llaverossorpresa",
  "#joyería",
  "#artesanal",
  "#joyeríaenplata",
  "#accesorio",
];

const allHashtagsRow3 = [
  "#hoodie",
  "#serigrafía",
  "#albumilustrado",
  "#ropa",
  "#decoloración",
  "#handmade",
  "#joyas",
  "#collares",
  "#madera",
  "#color",
  "#artesanía",
  "#aluminio",
  "#joyasaluminio",
  "#ceramica",
  "#fotografia",
  "#peluches",
  "#bolsos",
  "#bisutería",
  "#prendas",
  "#upcycling",
  "#pantalones",
  "#furby",
  "#parches",
];

// Hashtag scroller configuration
const hashtagRows = [
  {
    hashtags: allHashtagsRow1,
    direction: "left" as const,
    duration: 25,
    clickable: true,
  },
  {
    hashtags: allHashtagsRow2,
    direction: "right" as const,
    duration: 30,
    clickable: true,
  },
  {
    hashtags: allHashtagsRow3,
    direction: "left" as const,
    duration: 35,
    clickable: true,
  },
];

// VendorCard component
const VendorCard: React.FC<{
  vendor: Vendor;
  visible: boolean;
  onVerMapa: (vendorId: string) => void;
}> = ({ vendor, visible, onVerMapa }) => {
  if (!visible) return null;

  return (
    <section
      id={vendor.seccion}
      style={{
        padding: "1.5rem 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h3
        style={{
          fontFamily: "Neue Montreal, sans-serif",
          fontSize: "0.9em",
          color: "#666",
          marginBottom: "0.5rem",
          borderBottom: "none",
        }}
      >
        {vendor.mesa}
      </h3>
      <h2
        style={{
          fontFamily: "PKiko, serif",
          fontSize: "1.8rem",
          marginBottom: "0.5rem",
        }}
      >
        {vendor.nombre}
      </h2>
      <p style={{ marginBottom: "1rem", color: "#333" }}>
        {vendor.descripcion}
      </p>

      {vendor.instagram && vendor.instagram.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          {vendor.instagram.map((handle, idx) => (
            <a
              key={idx}
              href={`https://www.instagram.com/${handle.replace("@", "")}/`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#3cadff",
                textDecoration: "none",
              }}
            >
              {handle}
            </a>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "1rem",
        }}
      >
        {vendor.hashtags.map((tag, idx) => (
          <span
            key={idx}
            style={{
              backgroundColor: "#36e452",
              padding: "6px 12px",
              fontSize: "0.85em",
              fontFamily: "Neue Montreal, sans-serif",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => onVerMapa(vendor.id)}
        style={{
          display: "inline-block",
          padding: "8px 16px",
          background: "#36e452",
          color: "#040406",
          textDecoration: "none",
          borderRadius: "0",
          fontFamily: "Neue Montreal, sans-serif",
          cursor: "pointer",
          border: "none",
          fontSize: "14px",
        }}
      >
        Ver en el mapa
      </button>
    </section>
  );
};

export const MercadilloPlano: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<Set<string>>(
    new Set(vendors.map((v) => v.id)),
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const imgWidth = 2670;
    const imgHeight = 1641;

    // Create map with simple CRS for image overlay
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
    });

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [imgHeight, imgWidth],
    ];

    // Add the SVG image as overlay
    L.imageOverlay("/mapamesasmercadillo.svg", bounds).addTo(map);
    map.fitBounds(bounds);

    // Create markers for each vendor
    vendors.forEach((vendor) => {
      const popupContent = `
        <div style="font-family: Neue Montreal, sans-serif; font-weight: bold; font-size: 12px; margin-bottom: 4px;">
          ${vendor.mesa}
        </div>
        <div style="font-family: PKiko, sans-serif; font-size: 24px; line-height: 1.1; margin-bottom: 8px;">
          ${vendor.nombre}
        </div>
        <a href="#${vendor.seccion}" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #36e452; color: #000000; text-decoration: none; border-radius: 0; font-size: 12px; font-family: Neue Montreal, sans-serif;">
          Ver descripción
        </a>
      `;

      const customIcon = L.divIcon({
        className: "chincheta-icon",
        html: vendor.label,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(vendor.pos as L.LatLngExpression, {
        icon: customIcon,
      })
        .addTo(map)
        .bindPopup(popupContent);

      markersRef.current[vendor.id] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Filter vendors and update markers based on search term
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim().replace("#", "");
    const matching = new Set<string>();

    vendors.forEach((vendor) => {
      let hasMatch = false;

      if (term === "") {
        hasMatch = true;
      } else {
        hasMatch = vendor.hashtags.some((tag) =>
          tag.toLowerCase().replace("#", "").startsWith(term),
        );
      }

      if (hasMatch) {
        matching.add(vendor.id);
        // Show marker on map
        if (
          mapInstanceRef.current &&
          markersRef.current[vendor.id] &&
          !mapInstanceRef.current.hasLayer(markersRef.current[vendor.id])
        ) {
          markersRef.current[vendor.id].addTo(mapInstanceRef.current);
        }
      } else {
        // Hide marker from map
        if (mapInstanceRef.current && markersRef.current[vendor.id]) {
          mapInstanceRef.current.removeLayer(markersRef.current[vendor.id]);
        }
      }
    });

    setFilteredVendors(matching);
  }, [searchTerm]);

  // Handle "Ver en el mapa" click
  const handleVerMapa = (vendorId: string) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    if (vendor && mapInstanceRef.current && markersRef.current[vendorId]) {
      mapInstanceRef.current.setView(vendor.pos as L.LatLngExpression, 1);
      markersRef.current[vendorId].openPopup();
      mapRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle hashtag click from scroll
  const handleHashtagClick = (tag: string) => {
    const cleanTag = tag.replace("#", "");
    setSearchTerm(cleanTag);
    searchInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const visibleCount = filteredVendors.size;

  return (
    <main>
      <style>
        {`
          .chincheta-icon {
            background: #3cadff;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
            font-family: Neue Montreal, sans-serif;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          }
          .leaflet-popup-content-wrapper {
            border-radius: 0;
            font-family: Neue Montreal, sans-serif;
          }
          .leaflet-popup-tip {
            background: white;
          }
          section.hidden {
            display: none;
          }
        `}
      </style>

      <h1
        style={{
          textAlign: "center",
          fontFamily: "PKiko, serif",
          fontSize: "2.5rem",
          marginBottom: "1rem",
        }}
      >
        Plano Mercadillo
      </h1>

      {/* Leaflet Map */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
          background: "#f5f5f5",
          borderRadius: "0",
          marginBottom: "1rem",
        }}
      />

      {/* Hashtag scroll */}
      <HashtagScroller rows={hashtagRows} onHashtagClick={handleHashtagClick} />

      {/* Search */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar por hashtag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "16px",
            border: "2px solid #36e452",
            borderRadius: "0",
            fontFamily: "Neue Montreal, sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {searchTerm && (
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.9em",
              color: "#666",
            }}
          >
            Mostrando {visibleCount} de {vendors.length} puestos
          </p>
        )}
      </div>

      {/* Vendor list */}
      <div>
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            visible={filteredVendors.has(vendor.id)}
            onVerMapa={handleVerMapa}
          />
        ))}
      </div>

      {visibleCount === 0 && (
        <p style={{ textAlign: "center", color: "#666", padding: "2rem 0" }}>
          No se encontraron puestos con ese hashtag.
        </p>
      )}
    </main>
  );
};

export default MercadilloPlano;
