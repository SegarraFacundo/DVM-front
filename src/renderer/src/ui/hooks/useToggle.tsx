import { create } from 'zustand'

interface ToggleState {
  id: string
  isOpen: boolean
}

interface TogglesState {
  toggles: ToggleState[];
  getStateToggle: (id: string) => boolean
  addToggle: (id: string) => void;
  removeToggle: (id: string) => void;
  toggleOpenedState: (id: string) => void;
}

export const useToggle = create<TogglesState>((set, get) => ({
  // initial state
  toggles: [],
  getStateToggle: (id: string) => {
    const state = get().toggles.find(m => m.id === id)
    if (!state) return false
    return state.isOpen
  },
  // methods for manipulating state
  addToggle: (id: string) => {
    set((state) => {
      if (state.toggles.find(m => m.id === id)) { return { toggles: state.toggles } }

      return {
        toggles: [
          ...state.toggles,
        {
          id,
          isOpen: false
        } as ToggleState
        ]
      }
    })
  },
  removeToggle: (id) => {
    set((state) => ({
      toggles: state.toggles.filter((toggle) => toggle.id !== id)
    }))
  },
  toggleOpenedState: (id) => {
    set((state) => ({
      toggles: state.toggles.map((toggle) =>
        toggle.id === id
          ? ({ ...toggle, isOpen: !toggle.isOpen } as ToggleState)
          : toggle
      )
    }))
  }
}))
