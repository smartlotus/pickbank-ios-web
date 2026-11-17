import React from 'react';
import type { AppLang } from '../core/types';
import { COPY } from '../i18n/copy';

interface FooterProps {
  lang: AppLang;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = COPY[lang];

  return (
    <footer className="site-footer">
      <div className="section-inner footer-grid">
        <div className="footer-brand-col">
          <div className="footer-brand-lockup">
            <img
              src="/assets/icon-512.png"
              alt="PickBank Logo"
              width={40}
              height={40}
              className="nav-brand-icon"
            />
            <div>
              <strong className="footer-brand-name">PickBank · 拾念记账 iOS</strong>
              <p className="footer-tagline">{t.footerTagline}</p>
            </div>
          </div>
          <p className="footer-credit">{t.footerCredit}</p>
        </div>

        <nav className="footer-links" aria-label={lang === 'zh' ? '页脚导航' : 'Footer Navigation'}>
          <a href="#hero">Top</a>
          <a href="#cinema">{t.navFilm}</a>
          <a href="#simulator">{t.navSimulator}</a>
          <a href="#architecture">{t.navArchitecture}</a>
          <a href="#install">{t.navInstall}</a>
          <a href="https://github.com/smartlotus/pickbank-ios" target="_blank" rel="noreferrer">
            GitHub iOS
          </a>
          <a href="https://github.com/smartlotus/pickbank-ios-web" target="_blank" rel="noreferrer">
            GitHub Web
          </a>
          <a href="/downloads/altstore-source.json" target="_blank" rel="noreferrer">
            altstore-source.json
          </a>
        </nav>
      </div>
    </footer>
  );
};
