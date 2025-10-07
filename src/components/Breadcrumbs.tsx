/**
 * Breadcrumbs Component
 * Navigation breadcrumbs with modern design
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const BreadcrumbsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BreadcrumbItem = styled.span<{ $isLast?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $isLast, theme }) =>
    $isLast ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ $isLast }) => ($isLast ? 500 : 400)};

  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: color 0.2s;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Separator = styled(RightOutlined)`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textTertiary};
`;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const pathNameMap: Record<string, string> = {
  home: 'Home',
  modeling: 'Modeling',
  knowledge: 'Knowledge',
  'question-sql-pairs': 'SQL Pairs',
  instructions: 'Instructions',
  'api-management': 'API Management',
  history: 'History',
  profile: 'Profile',
  security: 'Security',
  admin: 'Admin',
  users: 'Users',
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const router = useRouter();
  
  const breadcrumbs = items || generateBreadcrumbsFromPath(router.pathname);

  return (
    <BreadcrumbsContainer className={className} aria-label="Breadcrumb">
      <BreadcrumbItem>
        <Link href="/">
          <a aria-label="Home">
            <HomeOutlined />
          </a>
        </Link>
      </BreadcrumbItem>
      
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          <Separator />
          <BreadcrumbItem $isLast={index === breadcrumbs.length - 1}>
            {item.href && index < breadcrumbs.length - 1 ? (
              <Link href={item.href}>
                <a>{item.label}</a>
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </BreadcrumbsContainer>
  );
};

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  
  return paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    const label = pathNameMap[path] || capitalize(path);
    
    return { label, href };
  });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

export default Breadcrumbs;

