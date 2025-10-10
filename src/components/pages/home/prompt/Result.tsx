import clsx from 'clsx';
import { ReactNode, useEffect, useRef, memo, useState } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PROCESS_STATE } from '@/utils/enum';
import { attachLoading } from '@/utils/helper';
import { BrainSVG } from '@/utils/svgs';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import StopOutlined from '@ant-design/icons/StopFilled';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import ErrorCollapse from '@/components/ErrorCollapse';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import RecommendedQuestions, {
  getRecommendedQuestionProps,
} from '@/components/pages/home/RecommendedQuestions';
import MarkdownBlock from '@/components/editor/MarkdownBlock';
import {
  AskingTaskType,
  RecommendedQuestionsTask,
} from '@/apollo/client/graphql/__types__';

const StyledResult = styled(motion.div)`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 0;
  width: 100%;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(12px);
  overflow: hidden;

  .dark & {
    background: rgba(30, 41, 59, 0.95);
    border-color: var(--border-secondary);
  }

  .adm-brain-svg {
    width: 14px;
    height: 14px;
  }
`;

interface Props {
  processState: PROCESS_STATE;
  data: {
    type: AskingTaskType;
    originalQuestion: string;
    askingStreamTask: string;
    recommendedQuestions: RecommendedQuestionsTask;
    intentReasoning: string;
  };
  error?: any;
  onIntentSQLAnswer: () => void;
  onSelectRecommendedQuestion: ({
    question,
    sql,
  }: {
    question: string;
    sql: string;
  }) => void;
  onClose: () => void;
  onStop: () => Promise<void>;
  loading?: boolean;
}

const Wrapper = ({ children }) => {
  return (
    <StyledResult
      className="p-4"
      data-testid="prompt__result"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </StyledResult>
  );
};

const makeProcessing = (text: string) => (props: Props) => {
  const { onStop } = props;
  const [loading, setLoading] = useState(false);
  return (
    <Wrapper>
      <motion.div
        className="d-flex justify-space-between align-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.span
          className="d-flex align-center"
          style={{ color: 'var(--text-primary)' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-flex' }}
          >
            <LoadingOutlined
              className="mr-2 text-lg"
              style={{ color: 'var(--accent-500)' }}
            />
          </motion.div>
          {text}
        </motion.span>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className={clsx(
              'adm-btn-no-style text-sm px-2',
              loading ? 'gray-6' : 'gray-7',
            )}
            type="text"
            size="small"
            onClick={attachLoading(onStop, setLoading)}
            disabled={loading}
            style={{
              background: 'var(--bg-hover)',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <StopOutlined className="-mr-1" />
            Stop
          </Button>
        </motion.div>
      </motion.div>
    </Wrapper>
  );
};

const makeProcessingError =
  (config: { icon: ReactNode; title?: string; description?: string }) =>
  (props: Props) => {
    const { onClose, onSelectRecommendedQuestion, data, error } = props;
    const { message, shortMessage, stacktrace } = error || {};
    const hasStacktrace = !!stacktrace;

    const recommendedQuestionProps = getRecommendedQuestionProps(
      data?.recommendedQuestions,
    );

    return (
      <Wrapper>
        <motion.div
          className="d-flex justify-space-between text-medium mb-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="d-flex align-center"
            style={{ color: 'var(--text-primary)' }}
          >
            {config.icon}
            {config.title || shortMessage}
          </div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="adm-btn-no-style text-sm px-2"
              type="text"
              size="small"
              onClick={onClose}
              style={{
                background: 'var(--bg-hover)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
              }}
            >
              <CloseOutlined className="-mr-1" />
              Close
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="gray-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-secondary)' }}
        >
          {config.description || data.intentReasoning || message}
        </motion.div>
        {hasStacktrace && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 }}
          >
            <ErrorCollapse className="mt-2" message={stacktrace.join('\n')} />
          </motion.div>
        )}

        {recommendedQuestionProps.show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RecommendedQuestions
              className="mt-2"
              {...recommendedQuestionProps.state}
              onSelect={onSelectRecommendedQuestion}
            />
          </motion.div>
        )}
      </Wrapper>
    );
  };

const ErrorIcon = () => <CloseCircleFilled className="mr-2 red-5 text-lg" />;

const Failed = makeProcessingError({
  icon: <ErrorIcon />,
});

const Understanding = makeProcessing('Understanding question');

const IntentionFinished = (props: Props) => {
  const { data, onIntentSQLAnswer } = props;
  const { type } = data;

  useEffect(() => {
    // create an empty response first if this is a text to sql task
    if (type === AskingTaskType.TEXT_TO_SQL) {
      onIntentSQLAnswer && onIntentSQLAnswer();
    }
  }, [type]);

  // To keep the UI result keep showing as understanding
  return <Understanding {...props} />;
};

const GeneralAnswer = (props: Props) => {
  const { onClose, onSelectRecommendedQuestion, data, loading } = props;
  const $wrapper = useRef<HTMLDivElement>(null);

  const { originalQuestion, askingStreamTask, recommendedQuestions } = data;
  const isDone = askingStreamTask && !loading;

  const scrollBottom = () => {
    if ($wrapper.current) {
      $wrapper.current.scrollTo({
        top: $wrapper.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollBottom();
  }, [askingStreamTask]);

  useEffect(() => {
    if (isDone) scrollBottom();
  }, [isDone]);

  const recommendedQuestionProps =
    getRecommendedQuestionProps(recommendedQuestions);

  return (
    <Wrapper>
      <motion.div
        className="d-flex justify-space-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className="d-flex align-start"
          style={{ color: 'var(--text-primary)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <MessageOutlined
              className="mr-2 mt-1"
              style={{ color: 'var(--accent-500)' }}
            />
          </motion.div>
          <b className="text-semi-bold">{originalQuestion}</b>
        </div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="adm-btn-no-style text-sm px-2"
            type="text"
            size="small"
            onClick={onClose}
            style={{
              background: 'var(--bg-hover)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
            }}
          >
            <CloseOutlined className="-mr-1" />
            Close
          </Button>
        </motion.div>
      </motion.div>
      <div className="py-3">
        <motion.div
          className="py-2 px-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="d-flex align-center">
            <BrainSVG className="mr-2 adm-brain-svg" />
            <span className="text-medium">User Intent Recognized</span>
          </div>
          <div style={{ paddingLeft: 22 }}>{data.intentReasoning}</div>
        </motion.div>

        <motion.div
          ref={$wrapper}
          className="py-2 px-3"
          style={{ maxHeight: 'calc(100vh - 480px)', overflowY: 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MarkdownBlock content={askingStreamTask} />
          <AnimatePresence>
            {isDone && (
              <motion.div
                className="gray-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                style={{ color: 'var(--text-tertiary)' }}
              >
                <InfoCircleOutlined className="mr-2" />
                For the most accurate semantics, please visit the modeling page.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {recommendedQuestionProps.show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecommendedQuestions
            {...recommendedQuestionProps.state}
            onSelect={onSelectRecommendedQuestion}
          />
        </motion.div>
      )}
    </Wrapper>
  );
};

const MisleadingQuery = makeProcessingError({
  icon: <WarningOutlined className="mr-2 text-lg gold-6" />,
  title: 'Clarification needed',
});

const getGeneralAnswerStateComponent = (state: PROCESS_STATE) => {
  return (
    {
      [PROCESS_STATE.FINISHED]: GeneralAnswer,
    }[state] || null
  );
};

const getMisleadingQueryStateComponent = (state: PROCESS_STATE) => {
  return (
    {
      [PROCESS_STATE.FINISHED]: MisleadingQuery,
    }[state] || null
  );
};

const getDefaultStateComponent = (state: PROCESS_STATE) => {
  return (
    {
      [PROCESS_STATE.UNDERSTANDING]: Understanding,
      // Polling AI status for every 1 second might skip the searching state.
      [PROCESS_STATE.SEARCHING]: IntentionFinished,
      [PROCESS_STATE.PLANNING]: IntentionFinished,
      [PROCESS_STATE.GENERATING]: IntentionFinished,
      // The finished status will respond by AI directly if viewId found, so we need to handle with intention finished.
      [PROCESS_STATE.FINISHED]: IntentionFinished,
      [PROCESS_STATE.FAILED]: Failed,
    }[state] || null
  );
};

const makeProcessStateStrategy = (type: AskingTaskType) => {
  // note that the asking task type only has value when the asking status was finished
  // by default, we use the default state component (also the text to sql state component)
  if (type === AskingTaskType.GENERAL) return getGeneralAnswerStateComponent;
  if (type === AskingTaskType.MISLEADING_QUERY)
    return getMisleadingQueryStateComponent;
  return getDefaultStateComponent;
};

export default memo(function PromptResult(props: Props) {
  const { processState, data } = props;

  const getProcessStateComponent = makeProcessStateStrategy(data?.type);
  const StateComponent = getProcessStateComponent(processState);

  if (StateComponent === null) return null;

  return <StateComponent {...props} />;
});
