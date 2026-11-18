import React from 'react';
import { ArrowDownToLine, Globe } from 'lucide-react';
import type { AppLang, SwissEdition } from '../core/types';
import { COPY } from '../i18n/copy';

interface LiquidNavbarProps {
  edition: SwissEdition;
  lang: AppLang;
  onSelectEdition: (edition: SwissEdition, triggerEl: HTMLElement | null) => void;
  onToggleLang: () => void;
}

const EDITIONS: SwissEdition[] = ['paper', 'carbon', 'hermes'];

export const LiquidNavbar: React.FC<LiquidNavbarProps> = ({
  edition,
  lang,
  onSelectEdition,
  onToggleLang,
}) => {
  const t = COPY[lang];

  return (
    <header className="swiss-masthead">
      <nav className="swiss-masthead-inner" aria-label={lang === 'zh' ? '主导航' : 'Primary Navigation'}>
        <a href="#hero" className="masthead-brand">
          <img
            src="/assets/icon-512.png"
            alt="PickBank App Icon"
            width={30}
            height={30}
            className="masthead-brand-icon"
          />
          <span className="masthead-brand-text">
            <strong className="masthead-brand-name">{t.brandTitle}</strong>
            <span className="masthead-brand-sub">{t.brandSub}</span>
          </span>
        </a>

        <div className="masthead-links">
          <a href="#cinema" className="masthead-link">
            {t.navFilm}
          </a>
          <a href="#simulator" className="masthead-link">
            {t.navSimulator}
          </a>
          <a href="#architecture" className="masthead-link">
            {t.navArchitecture}
          </a>
          <a href="#install" className="masthead-link">
            {t.navInstall}
          </a>
        </div>

        <div className="masthead-controls">
          <div className="edition-switcher" role="group" aria-label={t.editionAria}>
            {EDITIONS.map((ed) => {
              const active = edition === ed;
              return (
                <button
                  key={ed}
                  type="button"
                  aria-pressed={active}
                  className={`edition-btn edition-btn--${ed} ${active ? 'is-active' : ''}`}
                  onClick={(e) => onSelectEdition(ed, e.currentTarget)}
                >
                  <span className="edition-indicator" aria-hidden="true">
                    {active ? '■' : '□'}
                  </span>
                  <span>{t.editions[ed]}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="masthead-util-btn"
            aria-label={t.langToggleAria}
            onClick={onToggleLang}
          >
            <Globe size={14} aria-hidden="true" />
            <span>{t.langToggleLabel}</span>
          </button>

          <a href="#install" className="masthead-cta">
            <ArrowDownToLine size={14} aria-hidden="true" />
            <span>{t.navCta}</span>
          </a>
        </div>
      </nav>
    </header>
  );
};
