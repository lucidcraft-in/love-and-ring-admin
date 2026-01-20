import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Example slice demonstrating how to create Redux state for other features
 * This can be used as a template for creating new slices
 */

interface ExampleState {
  count: number;
  items: string[];
  isLoading: boolean;
}

const initialState: ExampleState = {
  count: 0,
  items: [],
  isLoading: false,
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    addItem: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { increment, decrement, setCount, addItem, removeItem, setLoading } = exampleSlice.actions;
export default exampleSlice.reducer;

// Selectors (optional but recommended)
export const selectCount = (state: { example: ExampleState }) => state.example.count;
export const selectItems = (state: { example: ExampleState }) => state.example.items;
export const selectIsLoading = (state: { example: ExampleState }) => state.example.isLoading;
