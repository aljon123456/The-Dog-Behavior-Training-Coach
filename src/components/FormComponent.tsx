import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createConversation, sendMessage } from '../store/chatSlice';
import { AppDispatch } from '../store';

interface FormComponentProps {
  currentConversationId?: string;
}

export const FormComponent: React.FC<FormComponentProps> = ({ currentConversationId }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      if (currentConversationId) {
        await dispatch(
          sendMessage({
            conversationId: currentConversationId,
            message: input,
          })
        ).unwrap();
      } else {
        await dispatch(createConversation(input)).unwrap();
      }
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t-2 border-black bg-white">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Ask about dog training and behavior..."
          className="flex-1 px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-500 transition-colors border-2 border-black"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};
