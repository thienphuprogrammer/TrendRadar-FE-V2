import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '@/hooks/useTheme';

const DemoContainer = styled.div`
  padding: 48px;
  background: var(--bg-secondary);
  border-radius: 16px;
  margin: 24px;
`;

const Section = styled(motion.div)`
  margin-bottom: 48px;
  padding: 32px;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-primary);
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
  font-family: var(--font-heading);
`;

const FontSample = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-hover);
    transform: translateX(4px);
  }

  .font-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .font-example {
    color: var(--text-primary);
  }
`;

const ThemeBadge = styled.div<{ theme: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme === 'light' 
    ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
    : 'linear-gradient(135deg, #1e293b, #0f172a)'};
  color: ${props => props.theme === 'light' ? '#92400e' : '#e0f2fe'};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 24px;

  .theme-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 2s infinite;
  }
`;

export default function FontDemo() {
  const { theme } = useTheme();

  return (
    <DemoContainer>
      <ThemeBadge theme={theme}>
        <span className="theme-dot"></span>
        <span>Current Theme: {theme.toUpperCase()}</span>
      </ThemeBadge>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle>Headings</SectionTitle>
        
        <FontSample>
          <div className="font-label">H1 Heading</div>
          <h1 className="font-example">The quick brown fox jumps</h1>
        </FontSample>

        <FontSample>
          <div className="font-label">H2 Heading</div>
          <h2 className="font-example">The quick brown fox jumps</h2>
        </FontSample>

        <FontSample>
          <div className="font-label">H3 Heading</div>
          <h3 className="font-example">The quick brown fox jumps</h3>
        </FontSample>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SectionTitle>Body Text</SectionTitle>
        
        <FontSample>
          <div className="font-label">Paragraph</div>
          <p className="font-example">
            The quick brown fox jumps over the lazy dog. This is a sample paragraph showing the primary font family.
            Notice how the font changes smoothly when you switch themes!
          </p>
        </FontSample>

        <FontSample>
          <div className="font-label">Gradient Text</div>
          <div className="text-gradient font-example" style={{ fontSize: '32px' }}>
            Beautiful Gradient Text
          </div>
        </FontSample>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionTitle>Code & Monospace</SectionTitle>
        
        <FontSample>
          <div className="font-label">Inline Code</div>
          <p className="font-example">
            This is some text with <code>inline code</code> using monospace font.
          </p>
        </FontSample>

        <FontSample>
          <div className="font-label">Code Block</div>
          <pre className="font-example">
{`function hello() {
  console.log('Hello World!');
  return true;
}`}
          </pre>
        </FontSample>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionTitle>Font Information</SectionTitle>
        
        <FontSample>
          <div className="font-label">Light Mode Fonts</div>
          <div className="font-example">
            <strong>Primary:</strong> Inter (Body text, UI elements)<br/>
            <strong>Heading:</strong> Poppins (Titles, headings)<br/>
            <strong>Monospace:</strong> JetBrains Mono (Code)
          </div>
        </FontSample>

        <FontSample>
          <div className="font-label">Dark Mode Fonts</div>
          <div className="font-example">
            <strong>Primary:</strong> Space Grotesk (Body text, UI elements)<br/>
            <strong>Heading:</strong> Poppins (Titles, headings)<br/>
            <strong>Monospace:</strong> JetBrains Mono (Code)
          </div>
        </FontSample>
      </Section>
    </DemoContainer>
  );
}
