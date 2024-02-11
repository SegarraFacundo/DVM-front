import create from 'zustand'

interface ModalState {
  id: string
  isOpen: boolean
}

interface ModalsState {
  modals: ModalState[];
  getStateModal: (id: string) => boolean
  addModal: (id: string) => void;
  removeModal: (id: string) => void;
  toggleOpenedState: (id: string) => void;
}

export const useModal = create<ModalsState>((set, get) => ({
  // initial state
  modals: [],
  getStateModal: (id: string) => {
    const state = get().modals.find(m => m.id === id)
    if (!state) return false
    return state.isOpen
  },
  // methods for manipulating state
  addModal: (id: string) => {
    set((state) => {
      if (state.modals.find(m => m.id === id)) { return { modals: state.modals } }

      return {
        modals: [
          ...state.modals,
        {
          id,
          isOpen: false
        } as ModalState
        ]
      }
    })
  },
  removeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id)
    }))
  },
  toggleOpenedState: (id) => {
    set((state) => ({
      modals: state.modals.map((modal) =>
        modal.id === id
          ? ({ ...modal, isOpen: !modal.isOpen } as ModalState)
          : modal
      )
    }))
  }
}))
