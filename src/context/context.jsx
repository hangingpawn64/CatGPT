import { useMemo, useState } from 'react';
import runCatGPT from '../config/gemini';
import { context } from './chatContext';

const createId = () => crypto.randomUUID();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find(({ id }) => id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  );

  const startNewChat = () => {
    setActiveConversationId(null);
    setInput('');
  };

  const selectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setInput('');
  };

  const clearConversations = () => {
    setConversations([]);
    setActiveConversationId(null);
    setInput('');
  };

  const onSent = async (prompt) => {
    const currentInput = (prompt ?? input).trim();
    if (!currentInput || loading) return;

    const conversationId = activeConversationId ?? createId();
    const userMessage = {
      id: createId(),
      role: 'user',
      content: currentInput,
    };
    const assistantMessage = {
      id: createId(),
      role: 'model',
      content: '',
      pending: true,
    };
    const previousMessages = activeConversation?.messages ?? [];
    const requestMessages = [...previousMessages, userMessage];

    setConversations((current) => {
      const existingConversation = current.find(({ id }) => id === conversationId);

      if (!existingConversation) {
        return [
          {
            id: conversationId,
            title: currentInput,
            messages: [userMessage, assistantMessage],
          },
          ...current,
        ];
      }

      return current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, userMessage, assistantMessage],
            }
          : conversation,
      );
    });

    setActiveConversationId(conversationId);
    setLoading(true);
    setInput('');

    try {
      const response = await runCatGPT(requestMessages);
      const responseText = response || 'Go away let me sleep hooman!';

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === assistantMessage.id
                    ? { ...message, content: responseText, pending: false }
                    : message,
                ),
              }
            : conversation,
        ),
      );
    } catch (error) {
      console.error('CatGPT error:', error);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === assistantMessage.id
                    ? {
                        ...message,
                        content: 'Go away let me sleep hooman!',
                        pending: false,
                      }
                    : message,
                ),
              }
            : conversation,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    conversations,
    activeConversation,
    activeConversationId,
    loading,
    input,
    setInput,
    onSent,
    startNewChat,
    selectConversation,
    clearConversations,
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export default ContextProvider;
