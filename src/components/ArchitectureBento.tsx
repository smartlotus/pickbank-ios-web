import React from 'react';
import { Binary, BookmarkCheck, Cpu, HardDrive, Layers } from 'lucide-react';
import type { AppLang } from '../core/types';
import { COPY } from '../i18n/copy';

interface ArchitectureBentoProps {
  lang: AppLang;
}

const ARCH_ICONS = [Binary, BookmarkCheck, Cpu, HardDrive, Layers];

export const ArchitectureBento: React.FC<ArchitectureBentoProps> = ({ lang }) => {
  const t = COPY[lang];

  return (
    <section id="architecture" className="section-block scroll-reveal">
      <div className="section-inner">
        <div className="section-header-split">
          <div>
            <p className="eyebrow-pill">
              <Cpu size={14} aria-hidden="true" />
              <span>{t.archEyebrow}</span>
            </p>
            <h2 className="section-title">{t.archHeading}</h2>
          </div>
        </div>

        <div className="arch-bento-grid">
          {t.archCards.map((card, idx) => {
            const Icon = ARCH_ICONS[idx % ARCH_ICONS.length];
            const spanWide = idx === 0 || idx === 3;
            return (
              <article
                key={card.tag}
                className={`bento-card-shell glass-surface scroll-reveal ${spanWide ? 'bento-span-wide' : ''}`}
              >
                <div className="bento-card-inner">
                  <div className="bento-card-head">
                    <span className="bento-icon-badge" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <span className="bento-tag">{card.tag}</span>
                  </div>

                  <div className="bento-card-copy">
                    <h3 className="bento-card-title">{card.title}</h3>
                    <p className="bento-card-desc">{card.desc}</p>
                  </div>

                  <div className="bento-card-foot">
                    <code className="bento-spec-code">{card.spec}</code>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
