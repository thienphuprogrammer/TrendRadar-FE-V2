import { Row, Col } from 'antd';
import styled from 'styled-components';
import { makeIterable } from '@/utils/iteration';
import EllipsisWrapper from '@/components/EllipsisWrapper';

const DemoBlock = styled.div`
  user-select: none;
  height: 150px;
  padding: 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, var(--primary-500), #8b5cf6);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-500);

    &::before {
      opacity: 1;
    }

    .demo-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }

  .demo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1));
    color: var(--primary-600);
    font-size: 16px;
    transition: all 0.3s ease;
  }
`;

interface Props {
  demo: any[];
  onSelect: (data: { label: string; question: string }) => void;
}

const DemoTemplate = ({ label, question, onSelect }) => {
  return (
    <Col span={8}>
      <DemoBlock onClick={() => onSelect({ label, question })}>
        <div className="demo-icon">💡</div>
        <div 
          style={{ 
            display: 'inline-flex',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: 'rgba(14, 165, 233, 0.1)',
            color: 'var(--primary-600)',
            marginBottom: '12px'
          }}
        >
          {label}
        </div>
        <EllipsisWrapper 
          multipleLine={3} 
          text={question}
          style={{
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: '1.6'
          }}
        />
      </DemoBlock>
    </Col>
  );
};

const DemoColumnIterator = makeIterable(DemoTemplate);

export default function DemoPrompt(props: Props) {
  const { demo, onSelect } = props;
  return (
    <div className="gray-8" style={{ width: 580 }}>
      <div className="text-center mt-3 mb-2">Try asking...</div>
      <Row gutter={16}>
        <DemoColumnIterator data={demo} onSelect={onSelect} />
      </Row>
    </div>
  );
}
