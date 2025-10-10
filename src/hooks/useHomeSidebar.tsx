import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Path } from '@/utils/enum';
import { handleGraphQLError, DEFAULT_DATA } from '@/utils/errorHandling';
import {
  useDeleteThreadMutation,
  useThreadsQuery,
  useUpdateThreadMutation,
} from '@/apollo/client/graphql/home.generated';

export default function useHomeSidebar() {
  const router = useRouter();
  const { data, refetch, error } = useThreadsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const [updateThread, { error: updateThreadError }] =
    useUpdateThreadMutation();

  const [deleteThread, { error: deleteThreadError }] =
    useDeleteThreadMutation();

  useEffect(() => {
    if (error) {
      const errorInfo = handleGraphQLError(error);
      console.error('Threads query error:', errorInfo.message);
    }
  }, [error]);

  useEffect(() => {
    if (updateThreadError) {
      const errorInfo = handleGraphQLError(updateThreadError);
      console.error('Update thread error:', errorInfo.message);
    }
  }, [updateThreadError]);

  useEffect(() => {
    if (deleteThreadError) {
      const errorInfo = handleGraphQLError(deleteThreadError);
      console.error('Delete thread error:', errorInfo.message);
    }
  }, [deleteThreadError]);

  const threads = useMemo(() => {
    if (!data?.threads) {
      // Return default empty array if data is not available
      return DEFAULT_DATA.threads;
    }
    return data.threads.map((thread) => ({
      id: thread.id.toString(),
      name: thread.summary,
    }));
  }, [data]);

  const onSelect = (selectKeys: string[]) => {
    router.push(`${Path.Home}/${selectKeys[0]}`);
  };

  const onRename = async (id: string, newName: string) => {
    await updateThread({
      variables: { where: { id: Number(id) }, data: { summary: newName } },
    });
    refetch();
  };

  const onDelete = async (id) => {
    await deleteThread({ variables: { where: { id: Number(id) } } });
    refetch();
  };

  return {
    data: { threads },
    onSelect,
    onRename,
    onDelete,
    refetch,
  };
}
