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

  useEffect(() => {
    const vid = theaterVideoRef.current;
    if (!vid) return;
    if (theaterOpen) {
      if (initialSeekSec !== null) {
        vid.currentTime = initialSeekSec;
      }
      vid.play().catch(() => {});
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
    <section id="cinema" className="swiss-section scroll-reveal">
      <div className="swiss-container">
        <div className="swiss-section-header">
          <div className="swiss-section-kicker-col">
            <p className="swiss-kicker">
              <Clapperboard size={13} aria-hidden="true" />
              <span>{t.cinemaIndex}</span>
            </p>
            <p className="mono-meta">1920 × 1080 · 30 FPS · H.264 / AAC</p>
          </div>
          <div className="swiss-section-title-col">
            <h2 className="swiss-section-title">{t.cinemaHeading}</h2>
            <p className="swiss-section-desc">{t.cinemaDesc}</p>
          </div>
        </div>

        {/* Asymmetric 4fr / 8fr Swiss Screening Grid */}
        <div className="cinema-swiss-grid">
          <div className="cinema-chapter-index" role="list" aria-label={t.cinemaJumpHint}>
            <div className="cinema-index-head">
              <span className="mono-label">{t.cinemaJumpHint}</span>
            </div>
            {CINEMA_CHAPTERS.map((ch, idx) => {
              const isAct = activeChapterId === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  role="listitem"
                  className={`cinema-index-row ${isAct ? 'is-active' : ''}`}
                  onClick={() => handleJumpChapter(ch.id, ch.timeSec)}
                >
                  <span className="cinema-row-num">0{idx + 1}</span>
                  <span className="cinema-row-time">{ch.timeLabel}</span>
                  <span className="cinema-row-copy">
                    <strong>{lang === 'zh' ? ch.zhTitle : ch.enTitle}</strong>
                    <span>{lang === 'zh' ? ch.zhSub : ch.enSub}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="cinema-screen-col">
            <div className="cinema-frame-box">
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
            </div>

            <div className="cinema-transport-bar">
              <button
                type="button"
                className="swiss-btn swiss-btn--ghost"
                onClick={togglePreviewPlayback}
              >
                {isPreviewPlaying ? (
                  <Pause size={15} aria-hidden="true" />
                ) : (
                  <Play size={15} aria-hidden="true" />
                )}
                <span>{isPreviewPlaying ? t.cinemaPausePreview : t.cinemaPlayPreview}</span>
              </button>

              <span className="mono-meta cinema-duration-tag">00:54 · REMOTION MASTER</span>

              <button
                type="button"
                className="swiss-btn swiss-btn--accent"
                onClick={() => onOpenTheater(0)}
              >
                <Volume2 size={15} aria-hidden="true" />
                <span>{t.cinemaOpenTheater}</span>
              </button>
            </div>
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
