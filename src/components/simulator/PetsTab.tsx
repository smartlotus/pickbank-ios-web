import React, { useEffect, useState } from 'react';
import { Heart, Moon, Pause, Play, Sun, Zap } from 'lucide-react';
import {
  MAX_DAILY_PET_INTERACTIONS,
  PET_SPECIES_LIST,
  PET_SPECIES_MAP,
  getPetInteractionKey,
  getRoomImageForPeriod,
} from '../../core/pets';
import type { AppLang, HabitatPeriod, PetSpeciesId, SimulatorStoreState } from '../../core/types';
import { COPY } from '../../i18n/copy';

interface PetsTabProps {
  lang: AppLang;
  state: SimulatorStoreState;
  onSelectSpecies: (species: PetSpeciesId) => void;
  onSetHabitatPeriod: (period: HabitatPeriod) => void;
  onToggleAnimations: () => void;
  onPetInteract: (species: PetSpeciesId) => boolean;
  onFeedPet: (species: PetSpeciesId, amount: number) => number;
}

interface HeartBurst {
  id: number;
  dx: number;
  dy: number;
}

export const PetsTab: React.FC<PetsTabProps> = ({
  lang,
  state,
  onSelectSpecies,
  onSetHabitatPeriod,
  onToggleAnimations,
  onPetInteract,
  onFeedPet,
}) => {
  const t = COPY[lang];
  const petState = state.snapshot.petState;
  const spec = PET_SPECIES_MAP[petState.activeSpecies] ?? PET_SPECIES_MAP.cat;
  const profile = petState.profiles[spec.id];

  const [frameIdx, setFrameIdx] = useState(0);
  const [hearts, setHearts] = useState<HeartBurst[]>([]);
  const [actionFlash, setActionFlash] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const interactionKey = getPetInteractionKey(spec.id);
  const todayCount = petState.interactions[interactionKey] ?? 0;

  // Cycle the 6-frame pixel sprite strip smoothly when animations are enabled
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!petState.animationsEnabled || prefersReduced) return;
    const timer = window.setInterval(() => {
      setFrameIdx((idx) => (idx + 1) % 6);
    }, 280);
    return () => window.clearInterval(timer);
  }, [petState.animationsEnabled, spec.id]);

  const activeFrames = petState.habitatPeriod === 'NIGHT' ? spec.nightFrames : spec.dayFrames;
  const currentSprite = actionFlash
    ? spec.portraitAction
    : activeFrames[frameIdx % activeFrames.length] ?? spec.portraitBase;

  const anchor = petState.habitatPeriod === 'NIGHT' ? spec.nightAnchor : spec.dayAnchor;
  const roomUrl = getRoomImageForPeriod(spec, petState.habitatPeriod);

  const handleTapPet = () => {
    const granted = onPetInteract(spec.id);
    setActionFlash(true);
    setTimeout(() => setActionFlash(false), 620);

    const burstId = Date.now() + Math.random();
    const dx = Math.round((Math.random() - 0.5) * 44);
    const dy = -12 - Math.round(Math.random() * 14);
    setHearts((prev) => [...prev.slice(-5), { id: burstId, dx, dy }]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== burstId));
    }, 950);

    if (granted) {
      setStatusMessage(
        lang === 'zh'
          ? `轻抚了${profile.name}：好感度 +1（今日 ${todayCount + 1}/${MAX_DAILY_PET_INTERACTIONS}）`
          : `Petted ${profile.enName}: Affection +1 (${todayCount + 1}/${MAX_DAILY_PET_INTERACTIONS} today)`
      );
    } else {
      setStatusMessage(t.petDailyCapReached);
    }
  };

  const handleFeed = () => {
    const fed = onFeedPet(spec.id, 10);
    if (fed > 0) {
      setActionFlash(true);
      setTimeout(() => setActionFlash(false), 750);
      setStatusMessage(
        lang === 'zh'
          ? `向${profile.name}投喂 +${fed}⚡ 守护能量！饱食度与成长值提升`
          : `Fed ${profile.enName} +${fed}⚡ energy! Satiety & Growth increased.`
      );
    } else {
      setStatusMessage(
        lang === 'zh'
          ? '饱食度已满或能量不足，继续理性记账即可赚取守护能量 ⚡'
          : 'Satiety is full or wallet energy is 0 — mindful budget savings earn ⚡!'
      );
    }
  };

  return (
    <div className="sim-pets-grid">
      {/* Habitat Stage */}
      <div className="sim-card pet-habitat-card">
        <div className="pet-habitat-topbar">
          <div className="pet-habitat-title">
            <span className="pixel-font pet-name-badge">
              {lang === 'zh' ? profile.name : profile.enName}
            </span>
            <span className="pet-room-name">
              {lang === 'zh' ? spec.habitatTitleZh : spec.habitatTitleEn}
            </span>
          </div>

          <div className="pet-topbar-controls">
            <div className="seg-group" role="group" aria-label={lang === 'zh' ? '昼夜光影' : 'Habitat Lighting'}>
              <button
                type="button"
                className={`seg-btn ${petState.habitatPeriod === 'DAY' ? 'is-active' : ''}`}
                onClick={() => onSetHabitatPeriod('DAY')}
              >
                <Sun size={13} aria-hidden="true" />
                <span>{t.petDay}</span>
              </button>
              <button
                type="button"
                className={`seg-btn ${petState.habitatPeriod === 'NIGHT' ? 'is-active' : ''}`}
                onClick={() => onSetHabitatPeriod('NIGHT')}
              >
                <Moon size={13} aria-hidden="true" />
                <span>{t.petNight}</span>
              </button>
            </div>

            <button
              type="button"
              className="sim-inline-btn"
              onClick={onToggleAnimations}
            >
              {petState.animationsEnabled ? (
                <Pause size={13} aria-hidden="true" />
              ) : (
                <Play size={13} aria-hidden="true" />
              )}
              <span>{petState.animationsEnabled ? t.petPauseAnim : t.petPlayAnim}</span>
            </button>
          </div>
        </div>

        <div className="pet-room-viewport">
          <img
            src={roomUrl}
            alt={lang === 'zh' ? `${spec.zhName}的${spec.habitatTitleZh}` : `${spec.enName} habitat`}
            width={941}
            height={680}
            className="pet-room-img"
          />

          <button
            type="button"
            className={`pet-sprite-hit ${actionFlash ? 'is-bouncing' : ''}`}
            style={{
              left: `${anchor[0] * 100}%`,
              top: `${anchor[1] * 100}%`,
              width: `${spec.spriteSizePct}%`,
            }}
            onClick={handleTapPet}
            aria-label={t.petTapHint}
          >
            <img
              src={currentSprite}
              alt={lang === 'zh' ? spec.zhName : spec.enName}
              width={256}
              height={256}
              className="pixel-sprite pet-sprite-img"
            />

            {hearts.map((h) => (
              <span
                key={h.id}
                className="pet-heart-float"
                style={{ '--dx': `${h.dx}px`, '--dy': `${h.dy}px` } as React.CSSProperties}
                aria-hidden="true"
              >
                +1 ♥
              </span>
            ))}
          </button>

          <div className="pet-room-hud-bottom">
            <span className="pixel-font pet-stage-pill">
              {profile.stage} · {profile.ageDays}d
            </span>
            <span className="pet-tap-instruction">{t.petTapHint}</span>
          </div>
        </div>

        <p className="pet-status-live" role="status" aria-live="polite">
          {statusMessage ||
            (lang === 'zh'
              ? `寿命周期 ${spec.lifespanDays} 天 · 昼夜房间同源渲染`
              : `${spec.lifespanDays}-day lifecycle · Homologous day/night lighting`)}
        </p>
      </div>

      {/* Stats + Energy + 8-Species Picker */}
      <div className="pet-side-col">
        <div className="sim-card pet-stats-card">
          <div className="pet-wallet-row">
            <div>
              <span className="duo-micro-label">{t.petEnergyWallet}</span>
              <strong className="pet-energy-value">
                <Zap size={16} aria-hidden="true" />
                <span>{petState.availableEnergy}</span>
              </strong>
            </div>

            <button type="button" className="btn-primary" onClick={handleFeed}>
              <Zap size={15} aria-hidden="true" />
              <span>{t.petFeedBtn}</span>
            </button>
          </div>

          <div className="pet-bars-list">
            <div className="pet-bar-row">
              <div className="pet-bar-labels">
                <span>{t.petSatiety}</span>
                <strong className="num-tabular">{profile.satiety}%</strong>
              </div>
              <div className="pet-meter-track">
                <div className="pet-meter-fill is-satiety" style={{ width: `${profile.satiety}%` }} />
              </div>
            </div>

            <div className="pet-bar-row">
              <div className="pet-bar-labels">
                <span>{t.petGrowth}</span>
                <strong className="num-tabular">{profile.growth} / 120</strong>
              </div>
              <div className="pet-meter-track">
                <div
                  className="pet-meter-fill is-growth"
                  style={{ width: `${Math.min(100, Math.round((profile.growth / 120) * 100))}%` }}
                />
              </div>
            </div>

            <div className="pet-bar-row">
              <div className="pet-bar-labels">
                <span>{t.petAffection}</span>
                <strong className="num-tabular">{profile.affection} / 100</strong>
              </div>
              <div className="pet-meter-track">
                <div className="pet-meter-fill is-affection" style={{ width: `${profile.affection}%` }} />
              </div>
            </div>

            <div className="pet-touch-quota">
              <Heart size={14} aria-hidden="true" />
              <span>
                {t.petTodayTouches}: {todayCount} / {MAX_DAILY_PET_INTERACTIONS}
              </span>
            </div>
          </div>
        </div>

        <div className="sim-card pet-species-card">
          <h3 className="sim-card-title">{t.petSelectTitle}</h3>
          <div className="pet-species-grid" role="group" aria-label={t.petSelectTitle}>
            {PET_SPECIES_LIST.map((sp) => {
              const selected = sp.id === spec.id;
              return (
                <button
                  key={sp.id}
                  type="button"
                  className={`pet-species-btn ${selected ? 'is-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => onSelectSpecies(sp.id)}
                >
                  <img
                    src={sp.portraitBase}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    className="pixel-sprite pet-species-thumb"
                  />
                  <span className="pixel-font pet-species-name">
                    {lang === 'zh' ? sp.zhName : sp.enName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
