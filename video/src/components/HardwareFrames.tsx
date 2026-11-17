import React from 'react';
import { FONT_SANS } from '../theme';

interface IPhoneFrameProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  tiltYDeg?: number;
  tiltXDeg?: number;
  screenBg?: string;
}

export const IPhone17ProFrame: React.FC<IPhoneFrameProps> = ({
  children,
  width = 396,
  height = 816,
  tiltYDeg = -8,
  tiltXDeg = 2.5,
  screenBg = '#0D0C0B',
}) => {
  const bezel = 12;
  const outerRadius = 58;
  const innerRadius = outerRadius - bezel + 2;

  return (
    <div
      style={{
        perspective: 1400,
        width,
        height,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${tiltYDeg}deg) rotateX(${tiltXDeg}deg)`,
          borderRadius: outerRadius,
          padding: bezel,
          background:
            'linear-gradient(135deg, #8B8378 0%, #3E3A35 28%, #1F1D1B 62%, #6F675E 100%)',
          boxShadow:
            '0 42px 96px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,248,231,0.22), inset 0 1px 2px rgba(255,255,255,0.45)',
        }}
      >
        {/* Titanium Side Buttons */}
        <div
          style={{
            position: 'absolute',
            left: -3.5,
            top: 150,
            width: 4,
            height: 34,
            borderRadius: '3px 0 0 3px',
            background: 'linear-gradient(180deg, #9C9488, #4D4842)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -3.5,
            top: 204,
            width: 4,
            height: 58,
            borderRadius: '3px 0 0 3px',
            background: 'linear-gradient(180deg, #9C9488, #4D4842)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -3.5,
            top: 274,
            width: 4,
            height: 58,
            borderRadius: '3px 0 0 3px',
            background: 'linear-gradient(180deg, #9C9488, #4D4842)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -3.5,
            top: 220,
            width: 4,
            height: 82,
            borderRadius: '0 3px 3px 0',
            background: 'linear-gradient(180deg, #9C9488, #4D4842)',
          }}
        />

        {/* Inner OLED Screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: innerRadius,
            background: screenBg,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.9)',
            fontFamily: FONT_SANS,
          }}
        >
          {/* iOS Status Bar + Dynamic Island */}
          <div
            style={{
              position: 'relative',
              height: 50,
              padding: '13px 26px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 20,
              color: '#FFF8E7',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
          >
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
            {/* Dynamic Island */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 11,
                transform: 'translateX(-50%)',
                width: 112,
                height: 30,
                borderRadius: 999,
                background: '#000000',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 9,
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #2D3E75, #060913)',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                <div style={{ width: 2.5, height: 4, borderRadius: 1, background: '#FFF8E7' }} />
                <div style={{ width: 2.5, height: 6, borderRadius: 1, background: '#FFF8E7' }} />
                <div style={{ width: 2.5, height: 8, borderRadius: 1, background: '#FFF8E7' }} />
                <div style={{ width: 2.5, height: 10, borderRadius: 1, background: '#FFF8E7' }} />
              </div>
              <div
                style={{
                  width: 21,
                  height: 10,
                  borderRadius: 3,
                  border: '1px solid rgba(255,248,231,0.55)',
                  padding: 1.5,
                  display: 'flex',
                }}
              >
                <div style={{ width: '82%', height: '100%', borderRadius: 1.5, background: '#A5D6A7' }} />
              </div>
            </div>
          </div>

          {/* App Viewport Content */}
          <div style={{ position: 'relative', height: 'calc(100% - 50px)', width: '100%' }}>
            {children}
          </div>

          {/* Home Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 7,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 124,
              height: 4.5,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.45)',
              zIndex: 30,
            }}
          />

          {/* Glass reflection overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'linear-gradient(122deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.01) 34%, transparent 50%)',
              zIndex: 40,
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface IPadFrameProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  variant?: 'classic' | 'hermes';
}

export const IPadPro13Frame: React.FC<IPadFrameProps> = ({
  children,
  width = 1220,
  height = 756,
  variant = 'classic',
}) => {
  const isHermes = variant === 'hermes';
  const bezel = 16;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 38,
        padding: bezel,
        position: 'relative',
        background: isHermes
          ? 'linear-gradient(135deg, #98A4D8 0%, #2C336E 36%, #14173D 70%, #6F7AC4 100%)'
          : 'linear-gradient(135deg, #8F877D 0%, #37332F 34%, #1A1816 70%, #736B61 100%)',
        boxShadow:
          '0 42px 98px rgba(0,0,0,0.68), 0 0 0 1px rgba(255,255,255,0.22), inset 0 1px 2px rgba(255,255,255,0.42)',
      }}
    >
      {/* Top landscape front camera dot */}
      <div
        style={{
          position: 'absolute',
          top: 5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#0A0D16',
          boxShadow: 'inset 0 0 2px rgba(100,150,255,0.6)',
        }}
      />

      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          background: isHermes ? '#0A0AB8' : '#141210',
          boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.85)',
          fontFamily: FONT_SANS,
        }}
      >
        {children}
        {/* Subtle glass sheen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(118deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 30%, transparent 48%)',
          }}
        />
      </div>
    </div>
  );
};
