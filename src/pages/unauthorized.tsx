/**
 * Unauthorized Page
 * Shown when user tries to access a page they don't have permission for
 */

import React from 'react';
import { useRouter } from 'next/router';
import { Button, Result } from 'antd';
import styled from 'styled-components';
import SimpleLayout from '@/components/layouts/SimpleLayout';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
`;

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  return (
    <SimpleLayout>
      <Container>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you don't have permission to access this page."
          extra={
            <>
              <Button type="primary" onClick={() => router.push('/')}>
                Go Home
              </Button>
              <Button onClick={() => router.back()}>Go Back</Button>
            </>
          }
        />
      </Container>
    </SimpleLayout>
  );
};

export default UnauthorizedPage;
