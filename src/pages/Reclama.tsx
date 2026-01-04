import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SignaturePad from "signature_pad";
import { Botón } from "../components/Botón";
import { GranBotón } from "../components/GranBotón";
import {
  PDFDocument,
  rgb,
  StandardFonts,
  PDFFont,
  RGB,
  PDFPage,
} from "pdf-lib";

interface FormData {
  Nombre: string;
  Apellidos: string;
  NIF: string;
  ESP: string;
  mail: string;
  tel: string;
  expone: string;
  solicita: string;
  documentos: string;
  fecha: string;
}

interface Notification {
  id: number;
  message: string;
}

export const Reclama: React.FC = () => {
  const [searchParams] = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationIdRef = useRef(0);
  const templateNotificationShownRef = useRef(false);

  const [formData, setFormData] = useState<FormData>({
    Nombre: "",
    Apellidos: "",
    NIF: "",
    ESP: "",
    mail: "",
    tel: "",
    expone: "",
    solicita: "",
    documentos: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  /**
   * Muestra una notificación emergente
   */
  const showNotification = useCallback((message: string, duration = 5000) => {
    const id = notificationIdRef.current++;
    setNotifications((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  /**
   * Ajusta el tamaño del canvas de forma responsiva
   */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
    }
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  }, []);

  /**
   * Inicializa el pad de firma
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("No se encontró el elemento canvas para el pad de firma");
      return;
    }

    resizeCanvas();
    signaturePadRef.current = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(0, 0, 0)",
      minWidth: 0.5,
      maxWidth: 2.5,
    });

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [resizeCanvas]);

  /**
   * Rellena los campos del formulario a partir de los parámetros de la URL
   */
  useEffect(() => {
    const expone = searchParams.get("expone");
    const solicita = searchParams.get("solicita");
    const documentos = searchParams.get("documentos");
    let plantillaAplicada = false;

    if (expone) {
      setFormData((prev) => ({ ...prev, expone }));
      plantillaAplicada = true;
    }

    if (solicita) {
      setFormData((prev) => ({ ...prev, solicita }));
      plantillaAplicada = true;
    }

    if (documentos) {
      setFormData((prev) => ({ ...prev, documentos }));
      plantillaAplicada = true;
    }

    if (plantillaAplicada && !templateNotificationShownRef.current) {
      showNotification("Plantilla aplicada correctamente.");
      templateNotificationShownRef.current = true;
    }
  }, [searchParams, showNotification]);

  /**
   * Maneja los cambios en los campos del formulario
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Limpia la firma
   */
  const clearSignature = () => {
    signaturePadRef.current?.clear();
  };

  /**
   * Valida los campos del formulario
   */
  const validateForm = (): boolean => {
    const camposObligatorios: (keyof FormData)[] = [
      "Nombre",
      "Apellidos",
      "NIF",
      "ESP",
      "mail",
      "tel",
      "expone",
      "solicita",
      "fecha",
    ];

    const labelMap: Record<string, string> = {
      Nombre: "Nombre",
      Apellidos: "Apellidos",
      NIF: "NIF",
      ESP: "Especialidad/curso/grupo",
      mail: "Correo electrónico",
      tel: "Teléfono",
      expone: "Expone",
      solicita: "Solicita",
      fecha: "Fecha",
    };

    for (const campo of camposObligatorios) {
      if (!formData[campo].trim()) {
        alert(`El campo "${labelMap[campo]}" es obligatorio.`);
        return false;
      }
    }

    if (signaturePadRef.current?.isEmpty()) {
      alert("Es necesario firmar el documento.");
      return false;
    }

    return true;
  };

  /**
   * Dibuja texto multilínea en una página de PDF
   */
  const drawMultilineText = (
    page: PDFPage,
    text: string,
    position: { x: number; y: number; maxWidth: number },
    font: PDFFont,
    fontSize: number,
    color: RGB,
  ) => {
    const { x, y, maxWidth } = position;
    const lineHeight = fontSize * 1.2;
    const charWidth = font.widthOfTextAtSize("a", fontSize);
    const maxChars = Math.floor(maxWidth / charWidth);
    let words = text.replace(/\n/g, " \n ").split(" ");
    words = words.flatMap((word) => {
      if (word === "\n" || word.length <= maxChars) return [word];
      const parts: string[] = [];
      for (let i = 0; i < word.length; i += maxChars) {
        parts.push(word.substr(i, maxChars));
      }
      return parts;
    });
    let currentLine = "";
    let currentY = y;

    for (const word of words) {
      if (word === "\n") {
        page.drawText(currentLine, {
          x,
          y: currentY,
          font,
          size: fontSize,
          color,
        });
        currentLine = "";
        currentY -= lineHeight;
        continue;
      }

      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && currentLine) {
        page.drawText(currentLine, {
          x,
          y: currentY,
          font,
          size: fontSize,
          color,
        });
        currentLine = word;
        currentY -= lineHeight;
      } else {
        currentLine = testLine;
      }
    }
    page.drawText(currentLine, { x, y: currentY, font, size: fontSize, color });
  };

  /**
   * Trunca el texto si excede el ancho máximo
   */
  const truncateText = (
    text: string,
    font: PDFFont,
    size: number,
    maxWidth: number,
  ): string => {
    if (!text) return "";
    const width = font.widthOfTextAtSize(text, size);
    if (width <= maxWidth) return text;
    let truncated = text;
    while (
      truncated.length > 0 &&
      font.widthOfTextAtSize(truncated + "...", size) > maxWidth
    ) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + "...";
  };

  /**
   * Procesa el formulario y genera el PDF
   */
  const procesarFormulario = async () => {
    setIsSubmitting(true);

    try {
      // 1. Cargar la plantilla PDF y la fuente monoespaciada
      const pdfPath = "/FORMULARIO-EXPONE_SOLICITA.pdf";
      const existingPdfBytes = await fetch(pdfPath).then((res) =>
        res.arrayBuffer(),
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);
      const firstPage = pdfDoc.getPages()[0];

      // 2. Definir posiciones y dibujar texto
      const positions = {
        apellidos: { x: 105, y: 685 },
        nombre: { x: 100, y: 667 },
        nif: { x: 85, y: 649 },
        especialidad: { x: 165, y: 631 },
        email: { x: 140, y: 614 },
        telefono: { x: 430, y: 614 },
        expone: { x: 70, y: 584, maxWidth: 450 },
        solicita: { x: 70, y: 410, maxWidth: 450 },
        documentos: { x: 70, y: 243, maxWidth: 450 },
        firma: { x: 230, y: 112, width: 150, height: 45 },
        dia: { x: 239, y: 177 },
        mes: { x: 288, y: 177 },
        ano: { x: 420, y: 177 },
      };

      const fontSize = 11;
      const fontColor = rgb(0, 0, 0);

      // Truncar textos largos para evitar desbordamiento
      const maxNameWidth = 200;
      const nombreText = truncateText(
        formData.Nombre,
        monoFont,
        fontSize,
        maxNameWidth,
      );
      const apellidosText = truncateText(
        formData.Apellidos,
        monoFont,
        fontSize,
        maxNameWidth,
      );

      firstPage.drawText(nombreText, {
        ...positions.nombre,
        size: fontSize,
        color: fontColor,
        font: monoFont,
      });
      firstPage.drawText(apellidosText, {
        ...positions.apellidos,
        size: fontSize,
        color: fontColor,
        font: monoFont,
      });
      firstPage.drawText(formData.NIF, {
        ...positions.nif,
        size: fontSize,
        color: fontColor,
        font: monoFont,
      });
      firstPage.drawText(formData.ESP, {
        ...positions.especialidad,
        size: fontSize,
        color: fontColor,
        font: monoFont,
      });
      firstPage.drawText(formData.mail, {
        ...positions.email,
        size: fontSize,
        color: fontColor,
        font: monoFont,
      });
      firstPage.drawText(formData.tel, {
        ...positions.telefono,
        size: fontSize,
        color: fontColor,
        font: monoFont,
      });

      drawMultilineText(
        firstPage,
        formData.expone,
        positions.expone,
        monoFont,
        fontSize,
        fontColor,
      );
      drawMultilineText(
        firstPage,
        formData.solicita,
        positions.solicita,
        monoFont,
        fontSize,
        fontColor,
      );
      drawMultilineText(
        firstPage,
        formData.documentos,
        positions.documentos,
        monoFont,
        fontSize,
        fontColor,
      );

      // Fecha
      if (formData.fecha) {
        const fechaObj = new Date(formData.fecha);
        const dia = fechaObj.getUTCDate().toString().padStart(2, "0");
        const meses = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        const mes = meses[fechaObj.getUTCMonth()];
        const ano = fechaObj.getUTCFullYear().toString().slice(-2);
        firstPage.drawText(dia, {
          ...positions.dia,
          size: fontSize,
          color: fontColor,
          font: monoFont,
        });
        firstPage.drawText(mes, {
          ...positions.mes,
          size: fontSize,
          color: fontColor,
          font: monoFont,
        });
        firstPage.drawText(ano, {
          ...positions.ano,
          size: fontSize,
          color: fontColor,
          font: monoFont,
        });
      }

      // 3. Insertar firma
      if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
        const firmaImgBase64 = signaturePadRef.current.toDataURL("image/png");
        const firmaImgBytes = await fetch(firmaImgBase64).then((res) =>
          res.arrayBuffer(),
        );
        const firmaImage = await pdfDoc.embedPng(firmaImgBytes);
        const firmaDims = firmaImage.scale(1);
        const { firma: firmaPos } = positions;
        const scale = Math.min(
          firmaPos.width / firmaDims.width,
          firmaPos.height / firmaDims.height,
        );

        firstPage.drawImage(firmaImage, {
          x: firmaPos.x,
          y: firmaPos.y,
          width: firmaDims.width * scale,
          height: firmaDims.height * scale,
        });
      }

      // 4. Guardar y descargar el PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      const now = new Date();
      const dia = now.getDate().toString().padStart(2, "0");
      const mes = (now.getMonth() + 1).toString().padStart(2, "0");
      const nombre = formData.Nombre || "Nombre";
      const apellidos = formData.Apellidos || "Apellidos";

      link.download = `${dia}-${mes}_${apellidos}_${nombre}_FORMULARIO-EXPONE_SOLICITA.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("PDF generado y descargado con éxito.");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert(
        "Hubo un error al generar el PDF. Revisa la consola para más detalles.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Función wrapper para submit desde GranBotón
   */
  const submitForm = () => {
    if (validateForm()) {
      procesarFormulario();
    }
  };

  return (
    <main>
      <h1>Expone / Solicita</h1>

      <div
        style={{
          backgroundColor: "rgb(54, 228, 82)",
          display: "flex",
          padding: 10,
          margin: 0,
        }}
      >
        <p style={{ flex: 1, margin: 0, padding: 0 }}>
          El formulario de Expone-Solicita de la escuela hecho fácil. <br />
          En la (aso) queremos ayudarte con los trámites burocráticos, puedes
          rellenar aquí tu Expone-Solicita.
          <br />
          Si lo prefieres, puedes{" "}
          <a
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://admin-dev.esdmadrid.es/wp-content/uploads/2020/04/FORMULARIO-EXPONE_SOLICITA_EDITABLE.pdf"
          >
            descargar el formulario en PDF
          </a>{" "}
          y entregarlo en la secretaría del centro, o por mail.
        </p>
      </div>

      <div className="hChips">
        <p className="hoTitle">Plantillas:</p>
        <a
          className="chip"
          href="?expone=La conexión WiFi de la escuela no llega a todas las aulas, lo que hace imposible acceder a Internet. Esto retrasa y dificulta la entrega de proyectos, ya que es una herramienta fundamental a la hora de trabajar con el ordenador.&solicita=Este problema debería solucionarse cuanto antes, ya sea instalando repetidores u otra medida similar. No puede seguir así, somos una escuela de diseño y trabajamos con ordenadores todos los días."
        >
          Wifi
        </a>
      </div>

      <form
        id="reclamacionesForm"
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="Nombre" className="label">
            Nombre*
          </label>
          <input
            type="text"
            name="Nombre"
            id="Nombre"
            value={formData.Nombre}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="Apellidos">Apellidos*</label>
          <input
            type="text"
            name="Apellidos"
            id="Apellidos"
            value={formData.Apellidos}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="NIF">NIF*</label>
          <input
            type="text"
            name="NIF"
            id="NIF"
            value={formData.NIF}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="ESP">Especialidad/curso/grupo*</label>
          <input
            type="text"
            name="ESP"
            id="ESP"
            value={formData.ESP}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="mail">Correo electrónico*</label>
          <input
            type="email"
            name="mail"
            id="mail"
            value={formData.mail}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="tel">Teléfono*</label>
          <input
            type="tel"
            name="tel"
            id="tel"
            value={formData.tel}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="expone">Expone*</label>
          <textarea
            name="expone"
            id="expone"
            rows={10}
            maxLength={900}
            value={formData.expone}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="solicita">Solicita*</label>
          <textarea
            name="solicita"
            id="solicita"
            rows={10}
            maxLength={900}
            value={formData.solicita}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="documentos">Documentación Adjunta</label>
          <textarea
            name="documentos"
            id="documentos"
            rows={5}
            maxLength={350}
            placeholder="Enlaces, recursos..."
            value={formData.documentos}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="fecha">Fecha*</label>
          <input
            type="date"
            name="fecha"
            id="fecha"
            value={formData.fecha}
            onChange={handleInputChange}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="firmaPad">Firma (dibujar abajo)*</label>
          <canvas id="firmaPad" ref={canvasRef} />
        </div>

        <Botón
          texto="Repetir firma"
          estilo="outlined"
          onClick={clearSignature}
        />

        <h3>Enviar a la escuela</h3>
        <p>
          Descarga el pdf generado y envíalo a{" "}
          <a href="mailto:administracion@esdmadrid.es">
            administracion@esdmadrid.es
          </a>{" "}
          o entregalo en la secretaría del centro.
        </p>

        <GranBotón
          texto={isSubmitting ? "Generando PDF..." : "Generar PDF"}
          icono="arrow_forward"
          onClick={submitForm}
        />
      </form>

      {/* Contenedor de notificaciones */}
      <div
        id="notification-container"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="notification-chip show"
            style={{
              backgroundColor: "#36e452",
              color: "#000",
              padding: "12px 20px",
              borderRadius: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </main>
  );
};
