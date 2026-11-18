import React from 'react';
import type { AppLang } from '../core/types';
import { COPY } from '../i18n/copy';

interface FooterProps {
  lang: AppLang;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = COPY[lang];

  return (
    <footer className="swiss-footer">
      <div className="swiss-container">
        <div className="swiss-footer-grid">
          <div className="footer-col">
            <span className="mono-meta">{t.colophonIndex}</span>
            <div className="footer-brand-row">
              <img
                src="/assets/icon-512.png"
                alt="PickBank Logo"
                width={38}
                height={38}
                className="masthead-brand-icon"
              />
              <div>
                <strong className="footer-brand-title">PICKBANK · 拾念记账</strong>
                <p className="mono-label">NATIVE SWIFT 6 + SWIFTUI APP</p>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <span className="mono-label">SOVEREIGNTY & LICENSE</span>
            <p className="footer-note">{t.footerTagline}</p>
            <p className="footer-note">{t.footerCredit}</p>
          </div>

          <div className="footer-col">
            <span className="mono-label">REPOSITORIES & FEED</span>
            <nav className="footer-nav-links" aria-label={lang === 'zh' ? '页脚导航' : 'Footer Navigation'}>
              <a href="https://github.com/smartlotus/pickbank-ios" target="_blank" rel="noreferrer">
                GitHub: smartlotus/pickbank-ios ↗
              </a>
              <a href="https://github.com/smartlotus/pickbank-ios-web" target="_blank" rel="noreferrer">
                GitHub: smartlotus/pickbank-ios-web ↗
              </a>
              <a href="/downloads/altstore-source.json" target="_blank" rel="noreferrer">
                altstore-source.json ↗
              </a>
            </nav>
          </div>

          <div className="footer-col">
            <span className="mono-label">INDEX</span>
            <nav className="footer-nav-links" aria-label="Section index">
              <a href="#hero">00 TOP</a>
              <a href="#cinema">{t.navFilm}</a>
              <a href="#simulator">{t.navSimulator}</a>
              <a href="#architecture">{t.navArchitecture}</a>
              <a href="#install">{t.navInstall}</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
