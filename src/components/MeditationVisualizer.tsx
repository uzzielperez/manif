import React, { useEffect, useRef } from 'react';

export type VisualizerType = 'aura' | 'loving-kindness' | 'chakra';

interface MeditationVisualizerProps {
  type: VisualizerType;
}

const SILHOUETTE_PATH = new Path2D("M6264 11241 c-81 -38 -146 -51 -256 -51 -113 0 -156 -18 -226 -95 -64 -70 -84 -115 -126 -282 -19 -76 -40 -154 -46 -173 -5 -19 -13 -89 -16 -155 -7 -147 -18 -210 -51 -281 -21 -47 -25 -66 -21 -132 5 -101 36 -168 122 -262 113 -123 141 -187 181 -419 27 -152 33 -344 14 -423 -13 -50 -92 -118 -194 -168 -160 -77 -526 -181 -705 -200 -223 -23 -286 -56 -481 -250 -122 -120 -150 -154 -165 -195 -9 -27 -42 -104 -72 -170 -29 -66 -65 -154 -79 -195 -37 -113 -84 -194 -179 -310 -47 -58 -102 -130 -123 -160 -33 -48 -236 -458 -271 -548 -7 -17 -28 -46 -47 -62 -43 -38 -104 -41 -154 -7 -19 13 -115 67 -214 122 -277 152 -427 243 -720 438 -390 260 -468 321 -630 492 -86 91 -194 192 -280 261 -171 136 -290 254 -349 344 -25 37 -52 70 -61 74 -26 10 -134 7 -155 -4 -19 -10 -40 -84 -40 -139 0 -15 -27 -82 -60 -148 -72 -144 -95 -225 -87 -304 5 -41 2 -61 -9 -77 -19 -28 -27 -27 -91 3 -79 36 -145 105 -246 255 l-91 134 -14 -44 c-18 -59 -10 -145 18 -201 13 -24 50 -84 82 -132 33 -49 66 -106 73 -128 l15 -40 -56 -25 c-62 -27 -62 -24 0 -92 56 -61 70 -64 267 -63 l178 2 42 -28 42 -28 294 -12 c161 -6 309 -17 328 -23 69 -23 166 -108 485 -430 179 -180 381 -373 449 -430 68 -57 166 -143 218 -192 51 -48 195 -178 320 -288 174 -153 236 -203 268 -211 23 -7 84 -9 145 -7 127 6 196 28 271 88 30 24 87 58 128 77 88 40 193 107 251 160 24 20 72 76 109 123 36 47 123 153 193 237 228 273 258 319 349 552 37 95 58 136 76 148 15 10 27 13 31 7 4 -6 22 -31 40 -57 47 -67 157 -410 206 -643 63 -300 73 -469 37 -624 -12 -52 -46 -239 -76 -416 -41 -245 -61 -340 -85 -402 -36 -93 -51 -112 -88 -112 -44 0 -369 114 -508 178 -134 62 -190 80 -413 131 -74 18 -140 36 -146 41 -6 5 -76 28 -155 51 -135 40 -153 43 -270 43 -146 1 -240 -22 -312 -77 -66 -50 -174 -182 -210 -255 -32 -64 -33 -72 -37 -207 -5 -207 12 -263 124 -420 130 -181 226 -280 453 -469 333 -274 305 -257 756 -481 396 -197 536 -271 536 -285 0 -4 -10 -16 -22 -27 -23 -20 -217 -58 -427 -83 -108 -13 -139 -31 -271 -161 -107 -106 -114 -117 -178 -274 -11 -27 -37 -88 -58 -135 -65 -145 -57 -252 24 -342 80 -89 177 -110 497 -112 178 0 216 3 340 26 77 15 222 34 322 43 216 18 306 35 424 81 49 19 150 47 226 64 76 17 167 40 203 51 143 47 489 191 680 283 89 43 129 45 268 15 143 -31 210 -51 498 -150 144 -50 320 -105 392 -124 82 -1 116 12 185 73 25 22 73 48 118 88 17 16 86 98 94 121 25 32 75 87 111 121 111 103 168 125 396 152 270 32 309 45 608 207 269 147 295 179 300 387 9 289 36 487 144 638 101 142 111 222 64 515 -46 278 -106 510 -157 605 -38 71 -102 131 -212 203 -55 35 -117 80 -305 75 -31 3 -59 13 -84 32 -72 55 -79 0 -115 0z m5313 -3135 c51 -109 59 -175 30 -233 l-17 -31 -80 82 -80 82 37 102 c24 64 43 101 51 100 7 -2 33 -47 59 -102z m-10411 -31 c28 -16 49 -39 63 -68 24 -50 26 -79 9 -177 -11 -63 -14 -70 -36 -70 -72 0 -122 70 -122 173 0 60 24 167 37 167 3 0 25 -11 49 -25z");
const SILHOUETTE_CENTER = 640;
const SVG_SCALE = 0.18;

export const MeditationVisualizer: React.FC<MeditationVisualizerProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', handleMouseMove);
    return () => window.removeEventListener('pointermove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      if (!canvas || !ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const w = canvas.width;
      const h = canvas.height;
      const cx = w >> 1;
      const cy = h * 0.35; // Moved to the top third of the screen

      if (type === 'aura') {
        t += 0.02;
        let b = (Math.sin(t) + 1) / 2;
        let R = 80 + 60 * b;
        let g = 150 + 100 * b;
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, w, h);
        ctx.beginPath();
        ctx.arc(cx, h / 2, R, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,${g},255,0.8)`;
        ctx.fill();
      } else if (type === 'loving-kindness') {
        t += 0.008;

        // Dark cosmic background
        ctx.fillStyle = '#000416';
        ctx.fillRect(0, 0, w, h);

        // drawNebula
        const drawNebula = (ncx: number, ncy: number) => {
          const pulse = Math.sin(t * 0.6) * 0.5 + 0.5;
          const g = ctx.createRadialGradient(ncx, ncy, 0, ncx, ncy, w);

          g.addColorStop(0, `hsla(220, 90%, 70%, ${0.4 + pulse * 0.35})`);
          g.addColorStop(0.3, `hsla(210, 65%, 40%, ${0.28 + pulse * 0.15})`);
          g.addColorStop(0.65, `hsla(200, 50%, 20%, 0.2)`);
          g.addColorStop(1, `hsla(220, 90%, 6%, 1)`);

          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        };

        // drawStars
        const drawStars = () => {
          ctx.fillStyle = "#ffffff";
          for (let i = 0; i < 400; i++) {
            const sx = (i * 137.5) % w;
            const sy = (i * 213.7) % h;
            const tw = 0.3 + Math.sin(t * 3 + i) * 0.3;
            ctx.globalAlpha = tw;
            ctx.fillRect(sx, sy, 1.3, 1.3);
          }
          ctx.globalAlpha = 1;
        };

        // drawMontblancAura
        const drawMontblancAura = (hcx: number, hcy: number) => {
          const breathe = Math.sin(t * 1.4) * 30 + 100; // Breathing core
          const pulse = Math.sin(t * 3) * 8; // micro shimmer
          const intensity = 0.65 + Math.sin(t * 2.2) * 0.25;

          for (let i = 0; i < 5; i++) {
            const r = breathe + pulse + i * 35;
            const alpha = (0.18 - i * 0.03) * intensity;

            const grad = ctx.createRadialGradient(hcx, hcy, 0, hcx, hcy, r);
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(0.35, `hsla(45, 100%, 75%, ${alpha + 0.2})`);
            grad.addColorStop(1, `hsla(215, 80%, 20%, 0)`);

            ctx.fillStyle = grad;
            ctx.fillRect(hcx - r, hcy - r * 0.8, r * 2, r * 1.6);
          }
        };

        // drawSilhouette
        const drawSilhouette = (fcx: number, fcy: number) => {
          ctx.save();
          ctx.translate(fcx, fcy);
          const breathe = Math.sin(t * 1.4) * 0.02 + 1;
          ctx.scale(SVG_SCALE * breathe, SVG_SCALE * breathe);
          ctx.translate(-SILHOUETTE_CENTER, -SILHOUETTE_CENTER);

          ctx.fillStyle = 'rgba(5, 5, 12, 0.98)';
          ctx.fill(SILHOUETTE_PATH);

          ctx.globalCompositeOperation = 'screen';
          ctx.strokeStyle = `hsla(45, 100%, 80%, ${0.14 + Math.sin(t * 2) * 0.04})`;
          ctx.lineWidth = 1.75;
          ctx.stroke(SILHOUETTE_PATH);
          ctx.globalCompositeOperation = 'source-over';

          ctx.restore();
        };

        drawNebula(cx, cy * 0.97);
        drawStars();
        drawMontblancAura(cx, cy - 50);
        drawSilhouette(cx, cy - 10);
      } else if (type === 'chakra') {
        t += 0.05;
        const cols = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        cols.forEach((col, i) => {
          let y = canvas.height * 0.8 - i * (canvas.height * 0.1);
          let s = 12 + 6 * Math.sin(t + i);
          ctx.beginPath();
          ctx.arc(canvas.width / 2, y, s, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 bg-black"
      style={{ touchAction: 'none' }}
    />
  );
};
