import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchConversation, setCurrentConversation } from '../store/chatSlice';
import { AppDispatch } from '../store';
import { Conversation } from '../store/chatSlice';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = async () => {
    dispatch(setCurrentConversation(conversation));
    dispatch(fetchConversation(conversation._id));
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
        isActive
          ? 'bg-black text-white border-2 border-black'
          : 'text-black hover:bg-gray-100 border-2 border-transparent'
      }`}
    >
      <p className="truncate text-sm font-medium">{conversation.title}</p>
      <p className={`text-xs mt-1 ${isActive ? 'text-gray-200' : 'text-gray-600'}`}>
        {conversation.messages?.length || 0} messages
      </p>
    </button>
  );
};
