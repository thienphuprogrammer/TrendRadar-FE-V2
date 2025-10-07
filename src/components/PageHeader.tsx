/**
 * Page Header Component
 * Consistent page header with title, breadcrumbs, and actions
 */

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Breadcrumbs from './Breadcrumbs';

const HeaderContainer = styled.div`
  padding: 24px 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  margin-bottom: 24px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 8px 0 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showBreadcrumbs?: boolean;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  showBreadcrumbs = true,
  className,
}) => {
  return (
    <HeaderContainer className={className}>
      {showBreadcrumbs && <Breadcrumbs />}
      <TitleRow>
        <div>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </div>
        {actions && <Actions>{actions}</Actions>}
      </TitleRow>
    </HeaderContainer>
  );
};

export default PageHeader;

