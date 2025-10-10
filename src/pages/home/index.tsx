// import ModernHome from './ModernHome';

// Temporary fallback to original home
import { ComponentRef, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
// import { motion } from 'framer-motion';
import { Path } from '@/utils/enum';
import SiderLayout from '@/components/layouts/SiderLayout';
import Prompt from '@/components/pages/home/prompt';
import EnhancedHome from '@/components/pages/home/EnhancedHome';
import useHomeSidebar from '@/hooks/useHomeSidebar';
import useAskPrompt from '@/hooks/useAskPrompt';
import useRecommendedQuestionsInstruction from '@/hooks/useRecommendedQuestionsInstruction';
// import ErrorFallback from '@/components/ErrorFallback';
import { DEFAULT_DATA, handleGraphQLError } from '@/utils/errorHandling';
import {
  useSuggestedQuestionsQuery,
  useCreateThreadMutation,
  useThreadLazyQuery,
} from '@/apollo/client/graphql/home.generated';
import { useGetSettingsQuery } from '@/apollo/client/graphql/settings.generated';
import { CreateThreadInput } from '@/apollo/client/graphql/__types__';

export default function Home() {
  const $prompt = useRef<ComponentRef<typeof Prompt>>(null);
  const router = useRouter();
  const homeSidebar = useHomeSidebar();
  const askPrompt = useAskPrompt();

  const { data: suggestedQuestionsData, error: suggestedQuestionsError } =
    useSuggestedQuestionsQuery({
      fetchPolicy: 'cache-and-network',
    });

  const [createThread, { error: createThreadError }] = useCreateThreadMutation({
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

  const [preloadThread, { error: preloadThreadError }] = useThreadLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const { data: settingsResult, error: settingsError } = useGetSettingsQuery();

  // Error handling moved to effects for Apollo 4 compatibility
  useEffect(() => {
    if (suggestedQuestionsError) {
      handleGraphQLError(suggestedQuestionsError);
      if (process.env.NODE_ENV === 'development') {
        console.info('Using default suggested questions');
      }
    }
  }, [suggestedQuestionsError]);

  useEffect(() => {
    if (createThreadError) {
      handleGraphQLError(createThreadError);
    }
  }, [createThreadError]);

  useEffect(() => {
    if (preloadThreadError) {
      handleGraphQLError(preloadThreadError);
    }
  }, [preloadThreadError]);

  useEffect(() => {
    if (settingsError) {
      handleGraphQLError(settingsError);
    }
  }, [settingsError]);

  // Safely access settings with fallback
  const settings = settingsResult?.settings || DEFAULT_DATA.settings;
  const isSampleDataset = useMemo(
    () => Boolean(settings?.dataSource?.sampleDataset),
    [settings],
  );

  // Use default data if API fails - UI will never crash
  const sampleQuestions = useMemo(() => {
    try {
      return (
        suggestedQuestionsData?.suggestedQuestions?.questions ||
        DEFAULT_DATA.suggestedQuestions
      );
    } catch (error) {
      console.error('Error accessing suggested questions:', error);
      return DEFAULT_DATA.suggestedQuestions;
    }
  }, [suggestedQuestionsData]);

  const onSelectQuestion = async ({ question }) => {
    console.log('onSelectQuestion', question);
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
      } catch (_preloadError) {
        if (process.env.NODE_ENV === 'development') {
          console.info('Thread will be loaded on navigation');
        }
      }

      router.push(Path.Home + `/${threadId}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to create thread:', error);
      }
      handleGraphQLError(error);
      // Error is handled gracefully - user sees default UI
    }
  };

  // Get recommended questions data
  const { recommendedQuestions, generating } =
    useRecommendedQuestionsInstruction();

  return (
    <SiderLayout loading={false} sidebar={homeSidebar}>
      <EnhancedHome
        isSampleDataset={isSampleDataset}
        sampleQuestions={sampleQuestions}
        recommendedQuestions={recommendedQuestions}
        loading={generating}
        onSelectSampleQuestion={onSelectQuestion}
        onSelectRecommendedQuestion={onCreateResponse}
      />
      <Prompt
        ref={$prompt}
        {...askPrompt}
        onCreateResponse={onCreateResponse}
      />
    </SiderLayout>
  );
}
