
import create from 'zustand';

export const useRecurringStore = create((set) => ({
  tasks: [],
  editingTask: null,
  setEditingTask: (id) => set({ editingTask: id }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map(t => t.id === updatedTask.id ? updatedTask : t),
    editingTask: null
  })),
}));
