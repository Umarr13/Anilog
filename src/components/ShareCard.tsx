/**
 * ShareCard — Feature #8
 * Generates a shareable PNG image card from the user's anime collection using Canvas API.
 * No external dependencies — pure browser Canvas.
 * Renders "My Top Rated", "Currently Watching", or a custom list.
 */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type AnimeEntry } from '../data/db';
import { useToast } from './Toast';

type CardMode = 'top_rated' | 'watching' | 'completed';

interface ShareCardProps {
  allAnime: AnimeEntry[];
}

const MODE_LABELS: Record<CardMode, string> = {
  top_rated: 'My Top Rated',
  watching: 'Currently Watching',
  completed: 'Completed',
};

const STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];

export default function ShareCard({ allAnime }: ShareCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<CardMode>('top_rated');
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showToast } = useToast();

  const getSubset = (): AnimeEntry[] => {
    let list = [...allAnime];
    if (mode === 'top_rated') {
      list = list.filter(a => a.score > 0).sort((a, b) => b.score - a.score);
    } else if (mode === 'watching') {
      list = list.filter(a => a.status === 'watching' || a.status === 'rewatching')
        .sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      list = list.filter(a => a.status === 'completed')
        .sort((a, b) => b.score - a.score);
    }
    return list.slice(0, 5);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const generateCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGenerating(true);

    const subset = getSubset();
    const W = 800;
    const H = 480;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1a1130');
    bg.addColorStop(1, '#0d1a2e');
    ctx.fillStyle = bg;
    ctx.roundRect(0, 0, W, H, 24);
    ctx.fill();

    // Header
    ctx.fillStyle = '#c9a0ff';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillText('anilog', 36, 52);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(MODE_LABELS[mode], 36, 76);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 92);
    ctx.lineTo(W - 36, 92);
    ctx.stroke();

    // Cards row
    const cardW = 120;
    const cardH = 160;
    const startX = 36;
    const startY = 110;
    const gap = (W - 72 - cardW * Math.min(subset.length, 5)) / (Math.min(subset.length, 5) - 1 || 1);

    for (let i = 0; i < subset.length; i++) {
      const anime = subset[i];
      const x = startX + i * (cardW + gap);

      // Cover art
      try {
        const img = await loadImage(anime.image);
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, startY, cardW, cardH, 12);
        ctx.clip();
        ctx.drawImage(img, x, startY, cardW, cardH);
        ctx.restore();
      } catch {
        ctx.fillStyle = '#2a2040';
        ctx.roundRect(x, startY, cardW, cardH, 12);
        ctx.fill();
      }

      // Gradient overlay
      const grad = ctx.createLinearGradient(x, startY + cardH * 0.5, x, startY + cardH);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = grad;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, startY, cardW, cardH, 12);
      ctx.clip();
      ctx.fillRect(x, startY, cardW, cardH);
      ctx.restore();

      // Rank badge
      ctx.fillStyle = '#c9a0ff';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(`#${i + 1}`, x + 8, startY + 20);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui';
      const maxW = cardW - 12;
      let title = anime.title;
      while (ctx.measureText(title).width > maxW && title.length > 0) {
        title = title.slice(0, -1);
      }
      if (title !== anime.title) title += '…';
      ctx.fillText(title, x + 6, startY + cardH - 24);

      // Stars
      if (anime.score > 0) {
        ctx.fillStyle = '#f5c518';
        ctx.font = '10px system-ui';
        ctx.fillText(STARS[anime.score] ?? '', x + 6, startY + cardH - 8);
      }
    }

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '12px system-ui';
    ctx.fillText('Made with Anilog · github.com/Umarr13/Anilog', 36, H - 18);

    setGenerating(false);

    // Download
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anilog-${mode}-card.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Share card saved! 🎌');
    }, 'image/png');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 p-4 bg-surface-variant rounded-2xl border border-surface hover:bg-surface-container transition-colors group"
      >
        <span className="material-symbols-outlined text-primary text-2xl">share</span>
        <div className="text-left">
          <p className="font-title-md text-on-surface">Share Card</p>
          <p className="font-body-sm text-on-surface-variant text-xs">Export your list as a shareable image</p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant ml-auto group-hover:text-primary transition-colors">chevron_right</span>
      </button>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="sc-backdrop"
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="sc-sheet"
              className="fixed bottom-0 left-0 right-0 z-[151] bg-surface-container-lowest rounded-t-3xl p-6 pb-10 flex flex-col gap-5"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            >
              <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto" />
              <h2 className="font-headline-md text-primary text-center">Generate Share Card</h2>
              <p className="font-body-sm text-on-surface-variant text-center -mt-3">Choose what to include</p>

              <div className="flex gap-3">
                {(Object.keys(MODE_LABELS) as CardMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-3 rounded-xl font-label-md text-sm transition-colors border ${
                      mode === m
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary'
                    }`}
                  >
                    {MODE_LABELS[m]}
                  </button>
                ))}
              </div>

              <button
                onClick={generateCard}
                disabled={generating || allAnime.length === 0}
                className="w-full py-4 bg-primary text-on-primary rounded-2xl font-label-md flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all"
              >
                {generating ? (
                  <><div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> Generating…</>
                ) : (
                  <><span className="material-symbols-outlined text-[20px]">download</span> Save as Image</>
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
