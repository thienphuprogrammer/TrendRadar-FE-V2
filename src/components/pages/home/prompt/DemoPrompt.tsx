import { Row, Col } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { makeIterable } from '@/utils/iteration';
import EllipsisWrapper from '@/components/EllipsisWrapper';

const DemoBlock = styled(motion.div)`
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
    background: var(--accent-gradient);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-500);

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
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.1),
      rgba(5, 150, 105, 0.1)
    );
    color: var(--accent-600);
    font-size: 16px;
    transition: all 0.3s ease;
  }
`;

interface Props {
  demo: any[];
  onSelect: (data: { label: string; question: string }) => void;
}

const DemoTemplate = ({ label, question, onSelect, index = 0 }) => {
  return (
    <Col span={8}>
      <DemoBlock
        onClick={() => onSelect({ label, question })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="demo-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 + index * 0.1, type: 'spring' }}
        >
          💡
        </motion.div>
        <motion.div
          style={{
            display: 'inline-flex',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--accent-600)',
            marginBottom: '12px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 + index * 0.1 }}
        >
          {label}
        </motion.div>
        <motion.div
          style={{
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: '1.6',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <EllipsisWrapper multipleLine={3} text={question} />
        </motion.div>
      </DemoBlock>
    </Col>
  );
};

const DemoColumnIterator = makeIterable(DemoTemplate);

export default function DemoPrompt(props: Props) {
  const { demo, onSelect } = props;
  return (
    <div style={{ width: '100%', maxWidth: 900, padding: '24px' }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}
      >
        ✨ Try asking these questions...
      </div>
      <Row gutter={[16, 16]}>
        <DemoColumnIterator data={demo} onSelect={onSelect} />
      </Row>
    </div>
  );
}
