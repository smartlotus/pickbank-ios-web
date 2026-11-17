import React, { useEffect, useRef, useState } from 'react';
import { Clapperboard, Pause, Play, Volume2 } from 'lucide-react';
import type { AppLang } from '../core/types';
import { CINEMA_CHAPTERS, COPY } from '../i18n/copy';
import { LiquidDialog } from './LiquidDialog';

interface CinemaSectionProps {
  lang: AppLang;
  theaterOpen: boolean;
  initialSeekSec: number | null;
  onOpenTheater: (seekSec?: number) => void;
  onCloseTheater: () => void;
}

export const CinemaSection: React.FC<CinemaSectionProps> = ({
  lang,
  theaterOpen,
  initialSeekSec,
  onOpenTheater,
  onCloseTheater,
}) => {
  const t = COPY[lang];
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const theaterVideoRef = useRef<HTMLVideoElement>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
  const [activeChapterId, setActiveChapterId] = useState<string>('intro');

  // Respect prefers-reduced-motion: default preview paused if user prefers reduced motion
  useEffect(() => {
    const vid = previewVideoRef.current;
    if (!vid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      vid.pause();
      setIsPreviewPlaying(false);
    } else {
      vid.play().catch(() => {
        setIsPreviewPlaying(false);
      });
    }
  }, []);

  // Sync theater playback & chapter seek when opened
  useEffect(() => {
    const vid = theaterVideoRef.current;
    if (!vid) return;
    if (theaterOpen) {
      if (initialSeekSec !== null) {
        vid.currentTime = initialSeekSec;
      }
      vid.play().catch(() => {
        // User can click play manually if autoplay with sound is blocked
      });
    } else {
      vid.pause();
    }
  }, [theaterOpen, initialSeekSec]);

  const togglePreviewPlayback = () => {
    const vid = previewVideoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPreviewPlaying(false);
    }
  };

  const handleJumpChapter = (chapterId: string, timeSec: number) => {
    setActiveChapterId(chapterId);
    const vid = theaterVideoRef.current;
    if (vid && theaterOpen) {
      vid.currentTime = timeSec;
      vid.play().catch(() => {});
    } else {
      onOpenTheater(timeSec);
    }
  };

  const handleTheaterTimeUpdate = () => {
    const vid = theaterVideoRef.current;
    if (!vid) return;
    const cur = vid.currentTime;
    let current = CINEMA_CHAPTERS[0].id;
    for (const ch of CINEMA_CHAPTERS) {
      if (cur >= ch.timeSec - 0.25) current = ch.id;
    }
    setActiveChapterId(current);
  };

  return (
    <section id="cinema" className="section-block scroll-reveal">
      <div className="section-inner">
        <div className="section-header-split">
          <div>
            <p className="eyebrow-pill">
              <Clapperboard size={14} aria-hidden="true" />
              <span>{t.cinemaEyebrow}</span>
            </p>
            <h2 className="section-title">{t.cinemaHeading}</h2>
          </div>
          <p className="section-desc">{t.cinemaDesc}</p>
        </div>

        <div className="cinema-stage glass-surface">
          <div className="cinema-frame">
            <video
              ref={previewVideoRef}
              className="cinema-video"
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/pets/rooms/cat_night.jpg"
              width={1920}
              height={1080}
              aria-label={t.cinemaDialogTitle}
            >
              <source src="/media/pickbank-ios-intro.mp4" type="video/mp4" />
            </video>

            <div className="cinema-overlay-bar">
              {/* WCAG 2.2.2 Pause/Play control; omits aria-pressed since visible label switches */}
              <button
                type="button"
                className="cinema-ctrl-btn"
                onClick={togglePreviewPlayback}
              >
                {isPreviewPlaying ? (
                  <Pause size={16} aria-hidden="true" />
                ) : (
                  <Play size={16} aria-hidden="true" />
                )}
                <span>{isPreviewPlaying ? t.cinemaPausePreview : t.cinemaPlayPreview}</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => onOpenTheater(0)}
              >
                <Volume2 size={16} aria-hidden="true" />
                <span>{t.cinemaOpenTheater}</span>
              </button>
            </div>
          </div>

          <div className="cinema-chapters-grid" role="list" aria-label={t.cinemaJumpHint}>
            {CINEMA_CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                role="listitem"
                className={`cinema-chapter-card ${activeChapterId === ch.id ? 'is-active' : ''}`}
                onClick={() => handleJumpChapter(ch.id, ch.timeSec)}
              >
                <span className="chapter-time">{ch.timeLabel}</span>
                <strong className="chapter-title">
                  {lang === 'zh' ? ch.zhTitle : ch.enTitle}
                </strong>
                <span className="chapter-sub">{lang === 'zh' ? ch.zhSub : ch.enSub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <LiquidDialog
        open={theaterOpen}
        onClose={onCloseTheater}
        titleId="cinema-dialog-title"
        title={t.cinemaDialogTitle}
        closeLabel={t.cinemaClose}
        subtitle={t.cinemaJumpHint}
        className="liquid-dialog--cinema"
      >
        <div className="theater-player-wrap">
          <video
            ref={theaterVideoRef}
            className="theater-video"
            controls
            playsInline
            preload="metadata"
            poster="/assets/pets/rooms/cat_night.jpg"
            width={1920}
            height={1080}
            onTimeUpdate={handleTheaterTimeUpdate}
          >
            <source src="/media/pickbank-ios-intro.mp4" type="video/mp4" />
          </video>

          <div className="theater-chapter-strip">
            {CINEMA_CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={`theater-chapter-btn ${activeChapterId === ch.id ? 'is-active' : ''}`}
                onClick={() => handleJumpChapter(ch.id, ch.timeSec)}
              >
                <span className="chapter-time">{ch.timeLabel}</span>
                <span>{lang === 'zh' ? ch.zhTitle : ch.enTitle}</span>
              </button>
            ))}
          </div>
        </div>
      </LiquidDialog>
    </section>
  );
};
