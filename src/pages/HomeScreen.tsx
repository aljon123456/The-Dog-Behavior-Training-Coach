import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchConversations } from '../store/chatSlice';
import { Sidebar } from '../components/Sidebar';
import { EmptyState } from '../components/EmptyState';
import { Message } from '../components/Message';
import { FormComponent } from '../components/FormComponent';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentConversation, messageLoading } = useSelector((state: RootState) => state.chat);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchConversations());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              <div className="max-w-2xl mx-auto">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-black">
                    {currentConversation.title}
                  </h1>
                </div>
                {messageLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-white"></div>
                    <p className="text-black mt-2">Loading conversation...</p>
                  </div>
                )}
                {currentConversation.messages?.map((message, index) => (
                  <Message key={index} message={message} />
                ))}
              </div>
            </div>

            {/* Message Input */}
            <FormComponent currentConversationId={currentConversation._id} />
          </>
        ) : (
          <>
            {/* Empty State */}
            <EmptyState />

            {/* Message Input for New Chat */}
            <FormComponent />
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;