import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Button } from 'antd';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
  tabs?: {
    label: string;
    key: string;
    icon?: React.ReactNode;
    badge?: number;
  }[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  children?: React.ReactNode;
}

const HeaderWrapper = styled(motion.div)`
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 24px 32px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .dark & {
    background: rgba(30, 41, 59, 0.95);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const PageIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
`;

const TitleContent = styled.div`
  flex: 1;

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.2;
  }

  p {
    font-size: 14px;
    color: var(--text-tertiary);
    margin: 4px 0 0;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-tertiary);

  .breadcrumb-item {
    cursor: pointer;
    transition: color 0.3s ease;

    &:not(:last-child)::after {
      content: '/';
      margin-left: 8px;
      color: var(--text-muted);
    }

    &:hover {
      color: var(--primary-600);
    }

    &:last-child {
      cursor: default;
      color: var(--text-secondary);
      font-weight: 600;

      &:hover {
        color: var(--text-secondary);
      }
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-secondary);
    border-radius: 2px;
  }
`;

const Tab = styled(motion.div)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${props => props.$active ? 'var(--primary-600)' : 'var(--bg-secondary)'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  border: 1px solid ${props => props.$active ? 'var(--primary-600)' : 'transparent'};

  .tab-icon {
    font-size: 16px;
  }

  .tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    font-size: 11px;
    font-weight: 600;
    background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-tertiary)'};
    color: ${props => props.$active ? 'white' : 'var(--text-tertiary)'};
    border-radius: 10px;
  }

  &:hover {
    background: ${props => props.$active ? 'var(--primary-700)' : 'var(--bg-hover)'};
    color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
    transform: translateY(-2px);
  }
`;

export default function PageHeader({
  title,
  subtitle,
  icon,
  breadcrumb,
  actions,
  tabs,
  activeTab,
  onTabChange,
  children,
}: PageHeaderProps) {
  return (
    <HeaderWrapper
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderTop>
        <TitleSection>
          {icon && <PageIcon>{icon}</PageIcon>}
          <TitleContent>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
            {breadcrumb && breadcrumb.length > 0 && (
              <Breadcrumb>
                {breadcrumb.map((item, index) => (
                  <span
                    key={index}
                    className="breadcrumb-item"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </span>
                ))}
              </Breadcrumb>
            )}
          </TitleContent>
        </TitleSection>
        {actions && <Actions>{actions}</Actions>}
      </HeaderTop>

      {tabs && tabs.length > 0 && (
        <Tabs>
          {tabs.map(tab => (
            <Tab
              key={tab.key}
              $active={activeTab === tab.key}
              onClick={() => onTabChange?.(tab.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </Tab>
          ))}
        </Tabs>
      )}

      {children}
    </HeaderWrapper>
  );
}
