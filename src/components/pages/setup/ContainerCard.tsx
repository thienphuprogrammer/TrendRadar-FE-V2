import styled from 'styled-components';
import { Card, Steps } from 'antd';
import { useTheme } from '@/hooks/useTheme';

const Container = styled.div<{ maxWidth?: number }>`
  max-width: ${(props) => props.maxWidth || 1200}px;
  margin: 68px auto;
`;

const StyledCard = styled(Card)<{ $isDark: boolean }>`
  && {
    background: ${props => props.$isDark ? '#1e293b' : '#ffffff'} !important;
    border-color: ${props => props.$isDark ? '#374151' : '#e2e8f0'} !important;
    
    .ant-card-body {
      background: transparent !important;
    }
  }
`;

interface Props {
  step: number;
  children: React.ReactNode;
  maxWidth?: number;
}

export default function ContainerCard(props: Props) {
  const { step, maxWidth } = props;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardStyle = {
    background: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#374151' : '#e2e8f0',
  };

  return (
    <Container maxWidth={maxWidth}>
      <StyledCard $isDark={isDark} style={cardStyle}>
        <Steps current={step} className="mb-12">
          <Steps.Step title="Connect" />
          <Steps.Step title="Select Tables" />
          <Steps.Step title="Define Relationships" />
        </Steps>
        <div className="px-12 pb-6">{props.children}</div>
      </StyledCard>
    </Container>
  );
}
