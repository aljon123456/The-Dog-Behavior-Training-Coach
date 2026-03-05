import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  _id: string;
  title: string;
  user: string;
  messages: Message[];
  createdAt?: string;
  updatedAt?: string;
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  messageLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  messageLoading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/conversations/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch conversations');
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/conversations/${id}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch conversation');
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (message: string, { rejectWithValue }) => {
    try {
      const payload = {
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        system: 'You are a Dog Behavior & Training Coach. You MUST NOT give veterinary advice or discuss other pets. Focus only on dog training and behavior.',
      };
      const response = await api.post('/conversation/', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { conversationId, message }: { conversationId: string; message: string },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        system: 'You are a Dog Behavior & Training Coach. You MUST NOT give veterinary advice or discuss other pets. Focus only on dog training and behavior.',
      };
      const response = await api.post(`/conversation/${conversationId}/`, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Conversation
      .addCase(fetchConversation.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.messageLoading = false;
        state.currentConversation = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload as string;
      })
      // Create Conversation
      .addCase(createConversation.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.messageLoading = false;
        state.currentConversation = action.payload;
        state.conversations.unshift(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload as string;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageLoading = false;
        state.currentConversation = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentConversation, clearCurrentConversation } = chatSlice.actions;
export default chatSlice.reducer;
