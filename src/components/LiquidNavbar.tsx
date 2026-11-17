import React from 'react';
import { Download, Globe, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import type { AppLang, AppThemeMode } from '../core/types';
import { COPY } from '../i18n/copy';

interface LiquidNavbarProps {
  theme: AppThemeMode;
  lang: AppLang;
  isStandalonePwa: boolean;
  onToggleTheme: (triggerEl: HTMLElement | null) => void;
  onToggleLang: () => void;
  onToggleStandalone: () => void;
}

export const LiquidNavbar: React.FC<LiquidNavbarProps> = ({
  theme,
  lang,
  isStandalonePwa,
  onToggleTheme,
  onToggleLang,
  onToggleStandalone,
}) => {
  const t = COPY[lang];

  return (
    <header className="nav-wrapper">
      <nav className="liquid-navbar glass-capsule" aria-label={lang === 'zh' ? '主导航' : 'Primary Navigation'}>
        <a href="#hero" className="nav-brand">
          <img
            src="/assets/icon-512.png"
            alt="PickBank App Icon"
            width={36}
            height={36}
            className="nav-brand-icon"
          />
          <span className="nav-brand-text">
            <strong className="nav-brand-name">{t.brandTitle}</strong>
            <span className="nav-brand-sub">{t.brandSub}</span>
          </span>
        </a>

        {!isStandalonePwa ? (
          <div className="nav-links">
            <a href="#cinema" className="nav-link">
              {t.navFilm}
            </a>
            <a href="#simulator" className="nav-link">
              {t.navSimulator}
            </a>
            <a href="#architecture" className="nav-link">
              {t.navArchitecture}
            </a>
            <a href="#install" className="nav-link">
              {t.navInstall}
            </a>
          </div>
        ) : null}

        <div className="nav-actions">
          <button
            type="button"
            className="nav-pill-btn nav-theme-btn"
            aria-label={t.themeAria}
            onClick={(e) => onToggleTheme(e.currentTarget)}
          >
            <span
              className={`theme-swatch theme-swatch--${theme === 'classic' ? 'hermes' : 'classic'}`}
              aria-hidden="true"
            />
            <span className="nav-btn-text">
              {theme === 'classic' ? t.themeToHermes : t.themeToClassic}
            </span>
          </button>

          <button
            type="button"
            className="nav-pill-btn"
            aria-label={t.langToggleAria}
            onClick={onToggleLang}
          >
            <Globe size={15} aria-hidden="true" />
            <span>{t.langToggleLabel}</span>
          </button>

          <button
            type="button"
            className="nav-pill-btn nav-pwa-btn"
            aria-label={isStandalonePwa ? t.pwaStandaloneExit : t.pwaStandaloneEnter}
            onClick={onToggleStandalone}
          >
            {isStandalonePwa ? (
              <Minimize2 size={15} aria-hidden="true" />
            ) : (
              <Maximize2 size={15} aria-hidden="true" />
            )}
            <span className="nav-pwa-label">
              {isStandalonePwa ? t.pwaStandaloneExit : t.pwaStandaloneEnter}
            </span>
          </button>

          {!isStandalonePwa ? (
            <a href="#install" className="nav-cta-btn">
              <Download size={15} aria-hidden="true" />
              <span>{t.navCta}</span>
            </a>
          ) : (
            <a href="#simulator" className="nav-cta-btn">
              <Sparkles size={15} aria-hidden="true" />
              <span>{t.simTabRecords}</span>
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};
