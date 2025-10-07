import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button, message, Table, TableColumnsType, Typography } from 'antd';
import { format } from 'sql-formatter';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SiderLayout from '@/components/layouts/SiderLayout';
import PageLayout from '@/components/layouts/PageLayout';
import FunctionOutlined from '@ant-design/icons/FunctionOutlined';
import { MORE_ACTION } from '@/utils/enum';
import { getCompactTime } from '@/utils/time';
import useDrawerAction from '@/hooks/useDrawerAction';
import useModalAction from '@/hooks/useModalAction';
import { MoreButton } from '@/components/ActionButton';
import { SQLPairDropdown } from '@/components/diagram/CustomDropdown';
import QuestionSQLPairModal from '@/components/modals/QuestionSQLPairModal';
import SQLPairDrawer from '@/components/pages/knowledge/SQLPairDrawer';
import { SqlPair } from '@/apollo/client/graphql/__types__';
import {
  useCreateSqlPairMutation,
  useDeleteSqlPairMutation,
  useSqlPairsQuery,
  useUpdateSqlPairMutation,
} from '@/apollo/client/graphql/sqlPairs.generated';

const SQLCodeBlock = dynamic(() => import('@/components/code/SQLCodeBlock'), {
  ssr: false,
});

const { Paragraph, Text } = Typography;

function QuestionSQLPairsPage() {
  const questionSqlPairModal = useModalAction();
  const sqlPairDrawer = useDrawerAction();

  const { data, loading } = useSqlPairsQuery({
    fetchPolicy: 'cache-and-network',
  });
  const sqlPairs = data?.sqlPairs || [];

  const getBaseOptions = (options: any) => {
    return {
      onError: (error: any) => console.error(error),
      refetchQueries: ['SqlPairs'],
      awaitRefetchQueries: true,
      ...options,
    };
  };

  const [createSqlPairMutation, { loading: createSqlPairLoading }] =
    useCreateSqlPairMutation(
      getBaseOptions({
        onCompleted: () => {
          message.success('Successfully created question-sql pair.');
        },
      }),
    );

  const [deleteSqlPairMutation] = useDeleteSqlPairMutation(
    getBaseOptions({
      onCompleted: () => {
        message.success('Successfully deleted question-sql pair.');
      },
    }),
  );

  const [editSqlPairMutation, { loading: editSqlPairLoading }] =
    useUpdateSqlPairMutation(
      getBaseOptions({
        onCompleted: () => {
          message.success('Successfully updated question-sql pair.');
        },
      }),
    );

  const onMoreClick = async (payload: any) => {
    const { type, data } = payload;
    if (type === MORE_ACTION.DELETE) {
      await deleteSqlPairMutation({
        variables: { where: { id: data.id } },
      });
    } else if (type === MORE_ACTION.EDIT) {
      questionSqlPairModal.openModal(data);
    } else if (type === MORE_ACTION.VIEW_SQL_PAIR) {
      sqlPairDrawer.openDrawer({ ...data, sql: format(data.sql) });
    }
  };

  const columns: TableColumnsType<SqlPair> = [
    {
      title: 'Question',
      dataIndex: 'question',
      width: 300,
      render: (question) => (
        <Paragraph title={question} ellipsis={{ rows: 2 }}>
          {question}
        </Paragraph>
      ),
    },
    {
      title: 'SQL statement',
      dataIndex: 'sql',
      width: '60%',
      render: (sql) => (
        <div style={{ width: '100%' }}>
          <SQLCodeBlock code={sql} maxHeight="130" />
        </div>
      ),
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      width: 130,
      render: (time) => <Text className="gray-7">{getCompactTime(time)}</Text>,
    },
    {
      key: 'action',
      width: 64,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <SQLPairDropdown onMoreClick={onMoreClick} data={record}>
          <MoreButton className="gray-8" />
        </SQLPairDropdown>
      ),
    },
  ];

  return (
    <SiderLayout loading={false}>
      <PageLayout
        title={
          <>
            <FunctionOutlined className="mr-2 gray-8" />
            Manage question-SQL pairs
          </>
        }
        titleExtra={
          <Button
            type="primary"
            className=""
            onClick={() => questionSqlPairModal.openModal()}
          >
            Add question-SQL pair
          </Button>
        }
        description={
          <>
            On this page, you can manage your saved question-SQL pairs. These
            pairs help Wren AI learn how your organization writes SQL, allowing
            it to generate queries that better align with your expectations.{' '}
            <Link
              className="gray-8 underline"
              href="https://docs.getwren.ai/oss/guide/knowledge/question-sql-pairs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more.
            </Link>
          </>
        }
      >
        <Table
          className="ant-table-has-header"
          dataSource={sqlPairs.filter(
            (sqlPair): sqlPair is SqlPair => sqlPair != null,
          )}
          loading={loading}
          columns={columns as TableColumnsType<SqlPair>}
          rowKey="id"
          pagination={{
            hideOnSinglePage: true,
            pageSize: 10,
            size: 'small',
          }}
          scroll={{ x: 1080 }}
        />
        <SQLPairDrawer
          {...sqlPairDrawer.state}
          defaultValue={
            sqlPairDrawer.state.open ? sqlPairDrawer.state.defaultValue : null
          }
          onClose={sqlPairDrawer.closeDrawer}
        />
        <QuestionSQLPairModal
          {...questionSqlPairModal.state}
          onClose={questionSqlPairModal.closeModal}
          loading={createSqlPairLoading || editSqlPairLoading}
          onSubmit={async ({ id, data }) => {
            if (id) {
              await editSqlPairMutation({
                variables: { where: { id }, data },
              });
            } else {
              await createSqlPairMutation({ variables: { data } });
            }
          }}
        />
      </PageLayout>
    </SiderLayout>
  );
}

export default function ManageQuestionSQLPairs() {
  return (
    <ProtectedRoute>
      <QuestionSQLPairsPage />
    </ProtectedRoute>
  );
}
