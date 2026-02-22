/* ============================================================
   MapaDor — Canvas interativo com imagem profissional de corpo
   Design: Clinical Modernism — azul-marinho + escala de cores
   ============================================================ */

import { useRef, useEffect, useState, useCallback } from "react";

const PAIN_COLORS = [
  { level: 1, color: "#22c55e", label: "Leve (1-2)" },
  { level: 3, color: "#84cc16", label: "Leve-mod (3-4)" },
  { level: 5, color: "#eab308", label: "Moderada (5-6)" },
  { level: 7, color: "#f97316", label: "Intensa (7-8)" },
  { level: 9, color: "#ef4444", label: "Severa (9-10)" },
];

interface PainCanvasProps {
  imageSrc: string;
  label: string;
  selectedColor: string;
  brushSize: number;
}

function PainCanvas({ imageSrc, label: _label, selectedColor, brushSize }: PainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setBgLoaded(true);
    };
    img.onerror = () => {
      console.error("Erro ao carregar imagem do mapa da dor");
      setBgLoaded(false);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
  };

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, overlay);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  }, [selectedColor, brushSize]);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    draw(e);
  }, [draw]);

  const stopDraw = useCallback(() => { isDrawing.current = false; }, []);

  const clearOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="pain-canvas-wrapper" style={{ width: 200, height: 400, position: "relative" }}>
        <canvas ref={canvasRef} width={200} height={400} style={{ position: "absolute", top: 0, left: 0, borderRadius: 4, display: "block" }} />
        <canvas
          ref={overlayRef}
          width={200}
          height={400}
          style={{ position: "absolute", top: 0, left: 0, borderRadius: 4, display: "block" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!bgLoaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#888" }}>
            Carregando...
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={clearOverlay}
        className="no-print text-xs text-muted-foreground hover:text-destructive transition-colors mt-1"
      >
        Limpar
      </button>
    </div>
  );
}

export default function MapaDor() {
  const [selectedLevel, setSelectedLevel] = useState(5);
  const [brushSize, setBrushSize] = useState(8);
  const selectedColor = PAIN_COLORS.find(c => c.level === selectedLevel)?.color || "#eab308";

  return (
    <div>
      {/* Controls */}
      <div className="no-print flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <div className="field-label mb-1">Intensidade / Cor</div>
          <div className="flex gap-1.5">
            {PAIN_COLORS.map(c => (
              <button
                key={c.level}
                type="button"
                onClick={() => setSelectedLevel(c.level)}
                title={c.label}
                style={{
                  background: c.color,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: selectedLevel === c.level ? "3px solid #1a3a5c" : "2px solid transparent",
                  transition: "transform 0.1s",
                  transform: selectedLevel === c.level ? "scale(1.2)" : "scale(1)"
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="field-label mb-1">Tamanho do pincel</div>
          <input
            type="range"
            min={4}
            max={20}
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* Canvases - Side by side */}
      <div className="flex gap-8 flex-wrap justify-center">
        <PainCanvas imageSrc="/pain-map.jpg" label="Frente e Costas" selectedColor={selectedColor} brushSize={brushSize} />
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {PAIN_COLORS.map(c => (
          <div key={c.level} className="flex items-center gap-1.5">
            <div style={{ width: 12, height: 12, borderRadius: 2, background: c.color }} />
            <span style={{ fontSize: "0.6875rem", color: "#555" }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
