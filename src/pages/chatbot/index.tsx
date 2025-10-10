import { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Tag, Space } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

const { TextArea } = Input;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  latency?: number;
}

export default function ChatbotPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingContent('');
    startTimeRef.current = Date.now();

    try {
      const eventSource = new EventSource(
        `/api/chatbot/stream?question=${encodeURIComponent(input)}&token=${token}`
      );

      let firstToken = true;
      let fullResponse = '';
      let latency = 0;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (firstToken) {
          latency = Date.now() - startTimeRef.current;
          firstToken = false;
        }

        if (data.type === 'token') {
          fullResponse += data.content;
          setStreamingContent(fullResponse);
        } else if (data.type === 'done') {
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
            latency
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setStreamingContent('');
          setLoading(false);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setLoading(false);
        setStreamingContent('');
        eventSource.close();
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      setLoading(false);
    }
  };

  const handleDeepDive = (query: string) => {
    router.push(`/trends/explorer?q=${encodeURIComponent(query)}`);
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div style={{ padding: '24px', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
            <RobotOutlined /> Trend Chatbot <Tag color="blue">Beta</Tag>
          </h1>

          <Card
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            bodyStyle={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, overflow: 'auto', marginBottom: '16px' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '16px',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {message.role === 'assistant' && (
                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  )}
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: message.role === 'user' ? '#1890ff' : '#f5f5f5',
                      color: message.role === 'user' ? '#fff' : '#000'
                    }}
                  >
                    <div>{message.content}</div>
                    {message.latency && (
                      <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.7 }}>
                        Response time: {message.latency}ms
                      </div>
                    )}
                    {message.role === 'assistant' && (
                      <div style={{ marginTop: '8px' }}>
                        <Button
                          size="small"
                          type="link"
                          icon={<LineChartOutlined />}
                          onClick={() => handleDeepDive(message.content)}
                          style={{ padding: 0 }}
                        >
                          Deep Dive
                        </Button>
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  )}
                </div>
              ))}

              {streamingContent && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: '#f5f5f5'
                    }}
                  >
                    {streamingContent}
                    <span className="blinking-cursor">▋</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about trends..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={loading}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                loading={loading}
                disabled={!input.trim()}
              >
                Send
              </Button>
            </div>
          </Card>

          <style jsx>{`
            .blinking-cursor {
              animation: blink 1s infinite;
            }
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          `}</style>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}


