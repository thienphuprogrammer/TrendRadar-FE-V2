import { Drawer, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { getCompactTime } from '@/utils/time';
import QuestionOutlined from '@ant-design/icons/QuestionOutlined';
import { DrawerAction } from '@/hooks/useDrawerAction';
import GlobalLabel from '@/components/pages/knowledge/GlobalLabel';
import { Instruction } from '@/apollo/client/graphql/__types__';

const { Text } = Typography;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-content {
    background: var(--bg-primary);
  }
  
  .ant-drawer-header {
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.05) 0%, 
      rgba(5, 150, 105, 0.05) 100%);
    border-bottom: 1px solid var(--border-primary);
    
    .ant-drawer-title {
      font-size: 20px;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .ant-drawer-body {
    padding: 24px;
  }
`;

const SectionContainer = styled(motion.div)`
  margin-bottom: 32px;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--accent-300);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  }
`;

const SectionTitle = styled(Typography.Text)`
  &.ant-typography {
    display: block !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--text-secondary) !important;
    margin-bottom: 12px !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const InstructionContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid var(--accent-500);
`;

const QuestionTag = styled(Tag)`
  &.ant-tag {
    background: rgba(16, 185, 129, 0.1) !important;
    border-color: var(--accent-300) !important;
    color: var(--accent-600) !important;
    border-radius: 8px !important;
    padding: 8px 12px !important;
    margin: 4px 8px 4px 0 !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
    
    &:hover {
      background: rgba(16, 185, 129, 0.15) !important;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
    }
  }
`;

const TimeInfo = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
`;

type Props = DrawerAction<Instruction>;

export default function InstructionDrawer(props: Props) {
  const { visible, defaultValue, onClose } = props;

  return (
    <StyledDrawer
      closable
      destroyOnClose
      onClose={onClose}
      title="Instruction Details"
      visible={visible}
      width={760}
    >
      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionTitle>Instruction Content</SectionTitle>
        <InstructionContent>
          {defaultValue?.instruction || 'No instruction provided'}
        </InstructionContent>
      </SectionContainer>

      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SectionTitle>Matching Questions</SectionTitle>
        <div>
          {defaultValue?.isDefault ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <GlobalLabel />
              <Text style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
                (applies to all questions)
              </Text>
            </div>
          ) : (
            <div>
              {defaultValue?.questions?.map((question, index) => (
                <QuestionTag key={`${question}-${index}`}>
                  <QuestionOutlined style={{ marginRight: '6px' }} />
                  {question}
                </QuestionTag>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SectionTitle>Created Time</SectionTitle>
        <TimeInfo>
          {defaultValue?.createdAt
            ? getCompactTime(defaultValue.createdAt)
            : 'No timestamp available'}
        </TimeInfo>
      </SectionContainer>
    </StyledDrawer>
  );
}
