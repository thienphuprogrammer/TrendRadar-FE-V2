import styled from 'styled-components';
import { Card, Steps } from 'antd';

const Container = styled.div<{ maxWidth?: number }>`
  max-width: ${(props) => props.maxWidth || 1200}px;
  margin: 68px auto;
`;

const StyledCard = styled(Card)`
  && {
    background: #ffffff !important;
    border-color: #e2e8f0 !important;
    
    .dark & {
      background: #1e293b !important;
      border-color: #374151 !important;
    }
    
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

  return (
    <Container maxWidth={maxWidth}>
      <StyledCard>
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
