import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, clearCurrentConversation } from '../store/chatSlice';
import { ConversationItem } from './ConversationItem';
import { AppDispatch, RootState } from '../store';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, currentConversation } = useSelector((state: RootState) => state.chat);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchConversations());
    }
  }, [dispatch, isAuthenticated]);

  const handleNewChat = () => {
    dispatch(clearCurrentConversation());
  };

  return (
    <aside className="w-64 bg-white border-r-2 border-black flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b-2 border-black">
        <h1 className="text-xl font-bold text-black">Dog Coach AI</h1>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="m-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 border-2 border-black"
      >
        <span>+</span> New Chat
      </button>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-4">
        {conversations.length === 0 ? (
          <p className="text-black text-sm text-center py-8">
            No conversations yet. Start a new chat!
          </p>
        ) : (
          <div>
            <h2 className="text-xs font-semibold text-black uppercase mb-3">History</h2>
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isActive={currentConversation?._id === conversation._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black p-4">
        <p className="text-xs text-black">
          Dog Behavior & Training Coach v1.0
        </p>
      </div>
    </aside>
  );
};
