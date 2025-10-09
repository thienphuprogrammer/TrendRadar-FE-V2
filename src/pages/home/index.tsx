// import ModernHome from './ModernHome';

// Temporary fallback to original home
import { ComponentRef, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Typography } from 'antd';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Path } from '@/utils/enum';
import SiderLayout from '@/components/layouts/SiderLayout';
import Prompt from '@/components/pages/home/prompt';
import DemoPrompt from '@/components/pages/home/prompt/DemoPrompt';
import useHomeSidebar from '@/hooks/useHomeSidebar';
import useAskPrompt from '@/hooks/useAskPrompt';
import useRecommendedQuestionsInstruction from '@/hooks/useRecommendedQuestionsInstruction';
import RecommendedQuestionsPrompt from '@/components/pages/home/prompt/RecommendedQuestionsPrompt';
import ErrorFallback from '@/components/ErrorFallback';
import { DEFAULT_DATA, handleGraphQLError } from '@/utils/errorHandling';
import {
  useSuggestedQuestionsQuery,
  useCreateThreadMutation,
  useThreadLazyQuery,
} from '@/apollo/client/graphql/home.generated';
import { useGetSettingsQuery } from '@/apollo/client/graphql/settings.generated';
import { CreateThreadInput } from '@/apollo/client/graphql/__types__';

const { Text } = Typography;

const Wrapper = ({ children }) => {
  return (
    <div
      className="d-flex align-center justify-center flex-column animate-fade-in"
      style={{ height: '100%' }}
    >
      <div className="animate-scale-in">
        <Logo size={48} color="var(--primary-600)" />
      </div>
      <div 
        className="text-md text-medium mt-3 animate-slide-up"
        style={{ 
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: '18px'
        }}
      >
        Know more about your data
      </div>
      {children}
    </div>
  );
};

const SampleQuestionsInstruction = (props) => {
  const { sampleQuestions, onSelect } = props;

  return (
    <Wrapper>
      <DemoPrompt demo={sampleQuestions} onSelect={onSelect} />
    </Wrapper>
  );
};

function RecommendedQuestionsInstruction(props) {
  const { onSelect, loading } = props;

  const {
    buttonProps,
    generating,
    recommendedQuestions,
    showRetry,
    showRecommendedQuestionsPromptMode,
  } = useRecommendedQuestionsInstruction();

  return showRecommendedQuestionsPromptMode ? (
    <div
      className="d-flex align-center flex-column pt-10"
      style={{ margin: 'auto' }}
    >
      <RecommendedQuestionsPrompt
        recommendedQuestions={recommendedQuestions}
        onSelect={onSelect}
        loading={loading}
      />
      <div className="py-12" />
    </div>
  ) : (
    <Wrapper>
      <Button className="mt-6" {...buttonProps} />
      {generating && (
        <Text className="mt-3 text-sm gray-6">
          Thinking of good questions for you... (about 1 minute)
        </Text>
      )}
      {!generating && showRetry && (
        <Text className="mt-3 text-sm gray-6 text-center">
          We couldn't think of questions right now.
          <br />
          Let's try again later.
        </Text>
      )}
    </Wrapper>
  );
}

export default function Home() {
  const $prompt = useRef<ComponentRef<typeof Prompt>>(null);
  const router = useRouter();
  const homeSidebar = useHomeSidebar();
  const askPrompt = useAskPrompt();

  const { data: suggestedQuestionsData, error: suggestedQuestionsError } = useSuggestedQuestionsQuery({
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      const errorInfo = handleGraphQLError(error);
      // Silently use fallback data - error already logged by handleGraphQLError
      if (process.env.NODE_ENV === 'development') {
        console.info('Using default suggested questions');
      }
    },
  });
  
  const [createThread, { loading: threadCreating, error: createThreadError }] = useCreateThreadMutation({
    onError: (error) => {
      handleGraphQLError(error);
      // Error logged by handleGraphQLError
    },
    onCompleted: () => {
      try {
        homeSidebar.refetch();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Refetch error:', error);
        }
      }
    },
  });
  
  const [preloadThread] = useThreadLazyQuery({
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      const errorInfo = handleGraphQLError(error);
      console.error('Preload thread error:', errorInfo.message);
      // Continue anyway - thread can be loaded later
    },
  });

  const { data: settingsResult, error: settingsError } = useGetSettingsQuery({
    onError: (error) => {
      const errorInfo = handleGraphQLError(error);
      console.error('Settings error:', errorInfo.message);
      // Use default settings if API fails
    },
  });
  
  // Safely access settings with fallback
  const settings = settingsResult?.settings || DEFAULT_DATA.settings;
  const isSampleDataset = useMemo(
    () => Boolean(settings?.dataSource?.sampleDataset),
    [settings],
  );

  // Use default data if API fails - UI will never crash
  const sampleQuestions = useMemo(
    () => {
      try {
        return suggestedQuestionsData?.suggestedQuestions?.questions || DEFAULT_DATA.suggestedQuestions;
      } catch (error) {
        console.error('Error accessing suggested questions:', error);
        return DEFAULT_DATA.suggestedQuestions;
      }
    },
    [suggestedQuestionsData],
  );

  const onSelectQuestion = async ({ question }) => {
    $prompt.current.submit(question);
  };

  const onCreateResponse = async (payload: CreateThreadInput) => {
    try {
      askPrompt.onStopPolling();
      const response = await createThread({ variables: { data: payload } });
      
      if (!response || !response.data || !response.data.createThread) {
        throw new Error('Invalid response from server');
      }
      
      const threadId = response.data.createThread.id;
      
      // Try to preload thread, but don't fail if it doesn't work
      try {
        await preloadThread({ variables: { threadId } });
      } catch (preloadError) {
        console.warn('Failed to preload thread, continuing anyway:', preloadError);
      }
      
      router.push(Path.Home + `/${threadId}`);
    } catch (error) {
      console.error('Failed to create thread:', error);
      const errorInfo = handleGraphQLError(error);
      // You could show a toast notification here if needed
      // message.error(errorInfo.message);
    }
  };

  return (
    <SiderLayout loading={false} sidebar={homeSidebar}>
      {isSampleDataset && (
        <SampleQuestionsInstruction
          sampleQuestions={sampleQuestions}
          onSelect={onSelectQuestion}
        />
      )}

      {!isSampleDataset && (
        <RecommendedQuestionsInstruction
          onSelect={onCreateResponse}
          loading={threadCreating}
        />
      )}
      <Prompt
        ref={$prompt}
        {...askPrompt}
        onCreateResponse={onCreateResponse}
      />
    </SiderLayout>
  );
}
