import React from 'react';
import { Cpu } from 'lucide-react';
import type { AppLang } from '../core/types';
import { COPY } from '../i18n/copy';

interface ArchitectureBentoProps {
  lang: AppLang;
}

export const ArchitectureBento: React.FC<ArchitectureBentoProps> = ({ lang }) => {
  const t = COPY[lang];

  return (
    <section id="architecture" className="swiss-section scroll-reveal">
      <div className="swiss-container">
        <div className="swiss-section-header">
          <div className="swiss-section-kicker-col">
            <p className="swiss-kicker">
              <Cpu size={13} aria-hidden="true" />
              <span>{t.archIndex}</span>
            </p>
            <p className="mono-meta">TARGET: SWIFT 6.0 / iOS 18–26</p>
          </div>
          <div className="swiss-section-title-col">
            <h2 className="swiss-section-title">{t.archHeading}</h2>
          </div>
        </div>

        {/* 6-Cell CSS Subgrid Swiss Architectural Matrix */}
        <div className="swiss-spec-grid">
          {t.archCards.map((card) => (
            <article key={card.num} className="swiss-spec-cell">
              <div className="swiss-cell-head">
                <span className="swiss-cell-num">{card.num}</span>
                <span className="mono-meta">{card.tag}</span>
              </div>

              <div className="swiss-cell-body">
                <h3 className="swiss-cell-title">{card.title}</h3>
                <p className="swiss-cell-desc">{card.desc}</p>
              </div>

              <div className="swiss-cell-foot">
                <code className="swiss-cell-code">{card.spec}</code>
              </div>
            </article>
          ))}
        </div>

        {/* Responsive Android -> iOS 1:1 Parity Table (responsive-table guide) */}
        <div className="parity-block">
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="parity-table-caption"
            className="swiss-table-region"
          >
            <table
              className="swiss-parity-table"
              style={
                {
                  '--label-1': `"${t.parityHeaders[0]}"`,
                  '--label-2': `"${t.parityHeaders[1]}"`,
                  '--label-3': `"${t.parityHeaders[2]}"`,
                } as React.CSSProperties
              }
            >
              <caption id="parity-table-caption">{t.parityCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.parityHeaders[0]}</th>
                  <th scope="col">{t.parityHeaders[1]}</th>
                  <th scope="col">{t.parityHeaders[2]}</th>
                </tr>
              </thead>
              <tbody>
                {t.parityRows.map((row) => (
                  <tr key={row.module}>
                    <th scope="row">{row.module}</th>
                    <td>{row.android}</td>
                    <td>{row.ios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
