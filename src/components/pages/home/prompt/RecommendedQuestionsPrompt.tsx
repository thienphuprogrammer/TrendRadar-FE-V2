import { useState, useMemo } from 'react';
import clsx from 'clsx';
import styled from 'styled-components';
import { Space, Button, Row, Col } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import ColumnHeightOutlined from '@ant-design/icons/ColumnHeightOutlined';
import MinusOutlined from '@ant-design/icons/MinusOutlined';
import EllipsisWrapper from '@/components/EllipsisWrapper';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Logo } from '@/components/Logo';
import { makeIterable } from '@/utils/iteration';
import { GroupedQuestion } from '@/hooks/useRecommendedQuestionsInstruction';

const CategorySectionBlock = styled(motion.div)`
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-md);

  .dark & {
    background: var(--bg-secondary);
  }
`;

const QuestionBlock = styled(motion.div)`
  background: var(--bg-primary);
  user-select: none;
  height: 150px;
  padding: 16px;
  border: 2px solid var(--border-primary);
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

  &:hover:not(.is-disabled) {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-500);

    &::before {
      opacity: 1;
    }
  }

  &.is-active {
    border-color: var(--accent-600);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);

    &::before {
      opacity: 1;
    }
  }

  &.is-disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .dark & {
    background: var(--bg-tertiary);
  }
`;

const MAX_EXPANDED_QUESTIONS = 9;

interface Props {
  onSelect: (payload: { sql: string; question: string }) => void;
  recommendedQuestions: GroupedQuestion[];
  loading: boolean;
}

const QuestionTemplate = ({
  category,
  sql,
  question,
  onSelect,
  loading,
  selectedQuestion,
  index,
}) => {
  const isSelected = selectedQuestion === question;
  const isDisabled = loading && !isSelected;

  const onClick = () => {
    if (loading) return;
    onSelect({ sql, question });
  };

  return (
    <Col span={8}>
      <QuestionBlock
        className={clsx({
          'is-active': isSelected,
          'is-disabled': isDisabled,
        })}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.98 }}
      >
        <motion.div
          className="d-flex justify-space-between align-center text-sm mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <motion.div
            className="px-2 rounded-pill text-truncate"
            title={category}
            style={{
              border: `1px solid var(--border-secondary)`,
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--accent-600)',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 12px',
            }}
            whileHover={{ scale: 1.05 }}
          >
            {category}
          </motion.div>
          <AnimatePresence>
            {isSelected && loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingOutlined className="ml-1" style={{ color: 'var(--accent-500)' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.6' }}>
          <EllipsisWrapper multipleLine={4} text={question} />
        </div>
      </QuestionBlock>
    </Col>
  );
};

const QuestionColumnIterator = makeIterable(QuestionTemplate);

export default function RecommendedQuestionsPrompt(props: Props) {
  const { onSelect, recommendedQuestions, loading } = props;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');

  const questionList = useMemo(() => {
    return recommendedQuestions.slice(
      0,
      isExpanded ? undefined : MAX_EXPANDED_QUESTIONS,
    );
  }, [recommendedQuestions, isExpanded]);

  const onHandleToggle = () => setIsExpanded((prev) => !prev);

  const showExpandButton = recommendedQuestions.length > MAX_EXPANDED_QUESTIONS;

  const onSelectQuestion = (payload: { sql: string; question: string }) => {
    onSelect(payload);
    setSelectedQuestion(payload.question);
  };

  return (
    <motion.div
      className="px-10 py-6"
      style={{ background: 'var(--bg-secondary)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="d-flex align-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Logo size={24} color="var(--accent-600)" />
        </motion.div>
        <motion.div
          className="text-md text-medium mx-3"
          style={{ color: 'var(--text-primary)', fontWeight: 600 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Know more about your data.
        </motion.div>
        <motion.div
          className="text-medium"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Try asking some of the following questions
        </motion.div>
      </motion.div>
      <Space
        style={{ width: 680 }}
        direction="vertical"
        size={[0, 16]}
      >
        <CategorySectionBlock
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Row gutter={[16, 16]} className="mt-3">
            <QuestionColumnIterator
              data={questionList}
              onSelect={onSelectQuestion}
              loading={loading}
              selectedQuestion={selectedQuestion}
            />
          </Row>
          <AnimatePresence>
            {showExpandButton && (
              <motion.div
                className="text-right"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => onHandleToggle()}
                    className="mt-3"
                    type="text"
                    size="small"
                    icon={
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: 'inline-flex' }}
                      >
                        {isExpanded ? <MinusOutlined /> : <ColumnHeightOutlined />}
                      </motion.div>
                    }
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {isExpanded ? 'Collapse' : 'Expand all'}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CategorySectionBlock>
      </Space>
    </motion.div>
  );
}
