import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🐕 Dog Behavior & Training Coach
          </h1>
          <p className="text-gray-600 text-lg">
            Your AI companion for dog training and behavior guidance
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How I can help:</h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li>✓ Dog training techniques and strategies</li>
            <li>✓ Behavior problem solutions</li>
            <li>✓ Puppy socialization tips</li>
            <li>✓ Positive reinforcement methods</li>
            <li>✓ Age-appropriate training advice</li>
          </ul>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Start by sending a message or select a past conversation from the sidebar
        </p>
      </div>
    </div>
  );
};
