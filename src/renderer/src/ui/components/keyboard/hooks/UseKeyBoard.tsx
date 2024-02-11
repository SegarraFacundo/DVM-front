import create from 'zustand'

interface KeyBoardsState {
  openedKeyBoard: boolean;
  value: string;
  toggleKeyBoard: () => void;
  setValue: (value: string) => void;
}

export const useKeyBoard = create<KeyBoardsState>((set) => ({
  value: '',
  openedKeyBoard: false,
  toggleKeyBoard: () =>
    set((state) => ({
      openedKeyBoard: !state.openedKeyBoard,
      value: state.value
    })),
  setValue: (value: string) =>
    set((state) => ({
      value,
      openedKeyBoard: state.openedKeyBoard
    }))
}))
