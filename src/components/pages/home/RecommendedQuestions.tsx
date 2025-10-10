import clsx from 'clsx';
import styled from 'styled-components';
import { useMemo } from 'react';
import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import BulbOutlined from '@ant-design/icons/BulbOutlined';
import { makeIterable } from '@/utils/iteration';
import {
  RecommendedQuestionsTask,
  RecommendedQuestionsTaskStatus,
} from '@/apollo/client/graphql/__types__';

export interface SelectQuestionProps {
  question: string;
  sql: string;
}

interface Props {
  items: { question: string; sql: string }[];
  loading?: boolean;
  error?: {
    shortMessage?: string;
    code?: string;
    message?: string;
    stacktrace?: string[];
  };
  className?: string;
  onSelect: ({ question, sql }: SelectQuestionProps) => void;
}

const QuestionItemWrapper = styled(motion.div)`
  position: relative;
  padding: 4px 0;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent-gradient);
    transition: width 0.3s ease;
  }

  &:hover::before {
    width: 100%;
  }
`;

export const getRecommendedQuestionProps = (
  data: RecommendedQuestionsTask,
  show = true,
) => {
  if (!data || !show) return { show: false };
  const questions = (data?.questions || []).slice(0, 3).map((item) => ({
    question: item.question,
    sql: item.sql,
  }));
  const loading = data?.status === RecommendedQuestionsTaskStatus.GENERATING;
  return {
    show: loading || questions.length > 0,
    state: {
      items: questions,
      loading,
      error: data?.error,
    },
  };
};

const QuestionItem = (props: {
  index: number;
  question: string;
  sql: string;
  onSelect: ({ question, sql }: SelectQuestionProps) => void;
}) => {
  const { index, question, sql, onSelect } = props;
  return (
    <QuestionItemWrapper
      className={clsx(index > 0 && 'mt-1')}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ x: 4 }}
    >
      <motion.span
        className="cursor-pointer"
        style={{ color: 'var(--text-primary)', display: 'inline-block' }}
        onClick={() => onSelect({ question, sql })}
        whileHover={{
          color: 'var(--accent-600)',
          transition: { duration: 0.2 },
        }}
      >
        {question}
      </motion.span>
    </QuestionItemWrapper>
  );
};
const QuestionList = makeIterable(QuestionItem);

export default function RecommendedQuestions(props: Props) {
  const { items, loading, className, onSelect } = props;

  const data = useMemo(
    () => items.map(({ question, sql }) => ({ question, sql })),
    [items],
  );

  return (
    <motion.div
      className={clsx('rounded p-3', className)}
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mb-2"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          style={{ display: 'inline-block' }}
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BulbOutlined
            className="mr-1"
            style={{ color: 'var(--accent-500)', fontSize: '16px' }}
          />
        </motion.div>
        <b
          className="text-semi-bold text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          Recommended questions
        </b>
      </motion.div>
      <motion.div
        className="pl-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Skeleton
          active
          loading={loading}
          paragraph={{ rows: 3 }}
          title={false}
        >
          <QuestionList data={data} onSelect={onSelect} />
        </Skeleton>
      </motion.div>
    </motion.div>
  );
}
