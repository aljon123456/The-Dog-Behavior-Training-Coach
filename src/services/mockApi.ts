// Mock API for testing without a backend
// This file provides dummy data and simulated API calls

interface User {
  id: string;
  email: string;
  username: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  _id: string;
  title: string;
  user: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Simulated database
let users: { [email: string]: { password: string; user: User } } = {
  'demo@example.com': {
    password: 'demo123',
    user: { id: 'user-1', email: 'demo@example.com', username: 'DemoTrainer' },
  },
  'test@example.com': {
    password: 'test123',
    user: { id: 'user-2', email: 'test@example.com', username: 'TestUser' },
  },
};

let conversations: Conversation[] = [
  {
    _id: 'conv-1',
    title: 'How to teach sit command',
    user: 'user-1',
    messages: [
      {
        role: 'user',
        content: 'How do I teach my dog to sit?',
      },
      {
        role: 'assistant',
        content:
          'Teaching "sit" is a fundamental command! Here are the steps:\n\n1. **Get a treat**: Hold a treat close to your dog\'s nose\n2. **Move upward**: Slowly move the treat above their head\n3. **Natural sit**: As their head follows the treat, their bottom naturally goes down\n4. **Say the word**: When their bottom touches the ground, say "Sit!" clearly\n5. **Reward immediately**: Give the treat and praise\n6. **Repeat**: Practice 5-10 times per session, multiple times daily\n\nTip: Use high-value treats during training. Be patient and consistent!',
      },
    ],
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:30:00Z',
  },
  {
    _id: 'conv-2',
    title: 'Dealing with jumping behavior',
    user: 'user-1',
    messages: [
      {
        role: 'user',
        content: 'My dog keeps jumping on people. What should I do?',
      },
      {
        role: 'assistant',
        content:
          'Jumping is usually a sign of excitement or attention-seeking. Here\'s how to address it:\n\n**Management strategies:**\n- Teach "sit" first - have your dog sit for greetings\n- Ignore jumping - don\'t reward with attention\n- Use baby gates to control access\n\n**Training approach:**\n1. When your dog sits, they get attention\n2. When they jump, turn away and ignore\n3. Reward calm behavior consistently\n4. Practice with friends - have them reward only sit behavior\n\n**Prevention:**\n- Provide plenty of exercise beforehand\n- Train a solid sit command\n- Be consistent - everyone must follow the same rules\n\nThis typically takes 2-4 weeks with consistent practice!',
      },
    ],
    createdAt: '2026-02-28T15:00:00Z',
    updatedAt: '2026-02-28T16:00:00Z',
  },
];

let nextConversationId = 3;

// Mock API Functions
export const mockSignUp = async (email: string, username: string, password: string) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (users[email]) {
    throw new Error('Email already registered');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    username,
  };

  users[email] = { password, user: newUser };

  return {
    token: `token-${Date.now()}`,
    user: newUser,
  };
};

export const mockSignIn = async (email: string, password: string) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const userData = users[email];

  if (!userData || userData.password !== password) {
    throw new Error('Invalid email or password');
  }

  return {
    token: `token-${Date.now()}`,
    user: userData.user,
  };
};

export const mockFetchConversations = async () => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return conversations;
};

export const mockFetchConversation = async (id: string) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const conversation = conversations.find((c) => c._id === id);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return conversation;
};

export const mockCreateConversation = async (message: string) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const aiResponse = generateAIResponse(message);

  const newConversation: Conversation = {
    _id: `conv-${nextConversationId++}`,
    title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
    user: 'user-1',
    messages: [
      {
        role: 'user',
        content: message,
      },
      {
        role: 'assistant',
        content: aiResponse,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  conversations.unshift(newConversation);
  return newConversation;
};

export const mockSendMessage = async (
  conversationId: string,
  message: string
) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const conversation = conversations.find((c) => c._id === conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const aiResponse = generateAIResponse(message);

  conversation.messages.push({
    role: 'user',
    content: message,
  });

  conversation.messages.push({
    role: 'assistant',
    content: aiResponse,
  });

  conversation.updatedAt = new Date().toISOString();

  return conversation;
};

// Simple AI response generator (mock)
function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  const houseTrainingResponse = 'House training takes patience and consistency! Take your puppy out frequently (after meals, naps, playtime). Praise enthusiastically when they go outside. Accidents happen - never punish. Clean accidents with enzymatic cleaner. Puppies typically need 8-16 weeks before being reliable.';

  const responses: { [key: string]: string } = {
    sit: 'Teaching "sit" is one of the easiest commands! Hold a treat above your dog\'s nose and move it back. As their head follows, their bottom naturally goes down. Say "Sit!" when they sit, reward immediately. Practice this 5-10 times daily for best results.',

    jump:
      'Jumping is usually excitement-seeking behavior. The key is to ignore the jumping and only reward calm behavior. Make sure your dog knows "sit" first, then reward them for sitting and ignore jumping. Be consistent - this takes about 2-4 weeks of practice.',

    recall:
      'Recall ("come") is critical for safety! Start in a small, enclosed space. Use high-value treats. Say "come" and immediately reward when they approach. Gradually increase distance and distractions. Never call your dog for something negative (like a bath). Make "come" always mean good things happen!',

    leash:
      'Leash training should start early with positive associations. Let them sniff and explore on leash. Reward walking beside you with treats. If they pull, stop walking and wait for slack, then continue. Practice in low-distraction areas first. Consistency is key!',

    house: houseTrainingResponse,
    pop: houseTrainingResponse,
    outside: houseTrainingResponse,
    potty: houseTrainingResponse,
    toilet: houseTrainingResponse,
    pee: houseTrainingResponse,
    bathroom: houseTrainingResponse,

    aggression:
      'Dog aggression is serious and needs professional help. Please consult a certified professional dog trainer or veterinary behaviorist. In the meantime, avoid triggering situations and ensure everyone\'s safety. Early intervention is crucial!',

    socialization:
      'Critical period is 3-14 weeks! Expose your puppy to different people, animals, environments, and sounds. Keep experiences positive with treats and toys. The goal is comfort and confidence in various situations. After 14 weeks, socialization becomes harder but still possible!',
  };

  // Find relevant response
  for (const keyword in responses) {
    if (lowerMessage.includes(keyword)) {
      return responses[keyword];
    }
  }

  // Default response
  return `That\'s a great question about dog training! As a Dog Behavior & Training Coach, I focus on positive reinforcement methods. Could you tell me more specifically what behavior you\'d like to work on? I can provide detailed training steps for:\n\n• Basic commands (sit, stay, come)\n• Behavior problems (jumping, pulling, barking)\n• Puppy training\n• Socialization\n• Leash manners\n• House training / Potty training\n\nWhat would you like to focus on?`;
}
