"use client"
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Editor, EditorProvider } from 'react-simple-wysiwyg';
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as React from "react"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
    type: ActionType["ADD_TOAST"]
    toast: ToasterToast
  }
  | {
    type: ActionType["UPDATE_TOAST"]
    toast: Partial<ToasterToast>
  }
  | {
    type: ActionType["DISMISS_TOAST"]
    toastId?: ToasterToast["id"]
  }
  | {
    type: ActionType["REMOVE_TOAST"]
    toastId?: ToasterToast["id"]
  }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
              ...t,
              open: false,
            }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}



const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>



type AnimationProps = {
  children: React.ReactNode;
  className?: string;
  animate?: Record<string, string[]>;
  transition?: {
    duration?: number;
    repeat?: number;
    repeatType?: string;
  };
};

const motion = {
  div: ({ children, ...props }: AnimationProps) => <div {...props}>{children}</div>
};

type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  date: string;
  isFavorite: boolean;
  type: 'note' | 'todo';
  todoItems?: { id: string; text: string; completed: boolean }[];
};

const getContrastColor = (backgroundColor: string): string => {
  const colorMap: Record<string, string> = {
    'yellow': 'text-gray-900',
    'red': 'text-gray-900',
    'lime': 'text-gray-900',
    'sky': 'text-gray-900',
    'purple': 'text-gray-900',
    'pink': 'text-gray-900',
    'orange': 'text-gray-900',
    'emerald': 'text-gray-900',
    'indigo': 'text-gray-900',
    'amber': 'text-gray-900',
    'teal': 'text-gray-900',
    'purple-300': 'text-gray-900',
    'orange-300': 'text-gray-900',
    'emerald-300': 'text-gray-900',
    'pink-300': 'text-gray-900'
  };

  let colorName = backgroundColor.includes('gradient')
    ? backgroundColor.split('-')[1] + '-300'
    : backgroundColor.split('-')[1];

  return colorMap[colorName] || 'text-gray-900';
};

const GradientPurpleBlue = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="h-full rounded-xl bg-gradient-to-br from-purple-300 to-blue-300"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    {children}
  </motion.div>
);

const GradientOrangeRed = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="h-full rounded-xl bg-gradient-to-br from-orange-300 to-red-300"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    {children}
  </motion.div>
);

const GradientGreenBlue = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="h-full rounded-xl bg-gradient-to-br from-emerald-300 to-sky-300"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    {children}
  </motion.div>
);

const GradientPinkPurple = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="h-full rounded-xl bg-gradient-to-br from-pink-300 to-purple-300"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    {children}
  </motion.div>
);

const NoteBackground = ({ color, children }: { color: string, children: React.ReactNode }) => {
  if (color === 'gradient-purple-blue') {
    return <GradientPurpleBlue>{children}</GradientPurpleBlue>;
  } else if (color === 'gradient-orange-red') {
    return <GradientOrangeRed>{children}</GradientOrangeRed>;
  } else if (color === 'gradient-green-blue') {
    return <GradientGreenBlue>{children}</GradientGreenBlue>;
  } else if (color === 'gradient-pink-purple') {
    return <GradientPinkPurple>{children}</GradientPinkPurple>;
  } else {
    return <div className={`${color} h-full rounded-xl`}>{children}</div>;
  }
};

function Keep() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('bg-yellow-200');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [noteType, setNoteType] = useState<'note' | 'todo'>('note');
  const [todoItems, setTodoItems] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: '1', text: '', completed: false }
  ]);
  const [markdownViewMode, setMarkdownViewMode] = useState<Record<string, 'markdown' | 'plaintext'>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }

    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      const updatedNotes = parsedNotes.map((note: Record<string, unknown>) => {
        const cleanNote: Partial<Note> = {};

        if (typeof note.id === 'string') cleanNote.id = note.id;
        if (typeof note.title === 'string') cleanNote.title = note.title;
        if (typeof note.content === 'string') cleanNote.content = note.content;
        if (typeof note.color === 'string') cleanNote.color = note.color;
        if (typeof note.date === 'string') cleanNote.date = note.date;
        if (typeof note.isFavorite === 'boolean') cleanNote.isFavorite = note.isFavorite;
        if (note.type === 'note' || note.type === 'todo') {
          cleanNote.type = note.type;
        } else {
          cleanNote.type = 'note';
        }
        if (note.type === 'todo' && Array.isArray(note.todoItems)) {
          cleanNote.todoItems = note.todoItems;
        }

        return cleanNote as Note;
      }).filter(Boolean);

      setNotes(updatedNotes);
    } else {
      setNotes([
        {
          id: '1',
          title: 'The beginning of screenless design',
          content: 'UI jobs to be taken over by Solution Architect\n\n**Bold text** and *italic text*',
          color: 'bg-yellow-200',
          date: 'May 21, 2020',
          isFavorite: false,
          type: 'note'
        },
        {
          id: '2',
          title: '13 Things You Should Give Up',
          content: 'Success requires sacrifice. To achieve greatness, you must give up many things.',
          color: 'bg-red-200',
          date: 'May 25, 2020',
          isFavorite: true,
          type: 'todo',
          todoItems: [
            { id: 't1', text: 'Perfectionism', completed: true },
            { id: 't2', text: 'Fear of failure', completed: false },
            { id: 't3', text: 'Comparing yourself to others', completed: false }
          ]
        },
        {
          id: '3',
          title: 'UI/UX Design Principles',
          content: 'Understanding human behavior is essential for designing user-centered interfaces.',
          color: 'bg-lime-200',
          date: 'June 5, 2020',
          isFavorite: false,
          type: 'note'
        },
        {
          id: '5',
          title: '52 Research Terms you need to know as a UX Designer',
          content: 'Master these key research concepts to improve your user experience design process and outcomes.\n\n## Heading 2\n\nSome regular text',
          color: 'gradient-orange-red',
          date: 'August 3, 2020',
          isFavorite: false,
          type: 'note'
        },
        {
          id: '6',
          title: 'Text fields & Forms design — UI components series',
          content: 'Best practices for creating usable and accessible form elements in your user interfaces.\n\n[Link text](https://example.com)',
          color: 'bg-teal-200',
          date: 'September 18, 2020',
          isFavorite: false,
          type: 'note'
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  const addTodoItem = () => {
    setTodoItems([...todoItems, { id: Date.now().toString(), text: '', completed: false }]);
  };

  const updateTodoItem = (id: string, text: string) => {
    setTodoItems(todoItems.map(item =>
      item.id === id ? { ...item, text } : item
    ));
  };

  const toggleTodoItem = (id: string) => {
    setTodoItems(todoItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeTodoItem = (id: string) => {
    setTodoItems(todoItems.filter(item => item.id !== id));
  };

  const prepareContentForDisplay = (content: string): string => {
    return content
      .replace(/\n/g, '<br/>')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  };
  const processContentForStorage = (content: string): string => {
    return content.replace(/<div><br><\/div>/g, '\n').replace(/<div>/g, '').replace(/<\/div>/g, '\n');
  };
  
  const addNote = () => {
    if (
      (noteType === 'note' && title.trim() === '' && content.trim() === '') ||
      (noteType === 'todo' && title.trim() === '' && todoItems.every(item => item.text.trim() === ''))
    ) return;

    const processedContent = noteType === 'note' 
      ? processContentForStorage(content)
      : '';

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content: processedContent,
      color,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      isFavorite: false,
      type: noteType
    };

    if (noteType === 'todo') {
      newNote.todoItems = todoItems.filter(item => item.text.trim() !== '');
    }

    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    setColor('bg-yellow-200');
    setTodoItems([{ id: '1', text: '', completed: false }]);
    setShowCreateNote(false);

    toast({
      title: "Note created",
      description: "Your note has been successfully created.",
    });
  };

  const deleteNote = (id: string) => {
    setNoteToDelete(id);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      setNotes(notes.filter(note => note.id !== noteToDelete));
      setNoteToDelete(null);

      toast({
        title: "Note deleted",
        description: "Your note has been successfully deleted.",
      });
    }
  };

  const toggleFavorite = (id: string) => {
    setNotes(
      notes.map(note =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );

    const note = notes.find(note => note.id === id);
    if (note) {
      toast({
        title: note.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `"${note.title}" has been ${note.isFavorite ? "removed from" : "added to"} your favorites.`,
      });
    }
  };

  const startEditingNote = (note: Note) => {
    const noteToEdit = { ...note };
    
    // If it's a note type, prepare content for editing
    if (noteToEdit.type === 'note') {
      noteToEdit.content = prepareContentForDisplay(noteToEdit.content);
    }
    
    setEditingNote(noteToEdit);
  };

  const updateNote = () => {
    if (!editingNote) return;

    if (editingNote.type === 'note') {
      editingNote.content = processContentForStorage(editingNote.content);
    }

    const updatedNoteData = { ...editingNote };

    setNotes(
      notes.map(note =>
        note.id === updatedNoteData.id ? updatedNoteData : note
      )
    );

    setEditingNote(null);

    toast({
      title: "Note updated",
      description: "Your changes have been saved.",
    });
  };

  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(searchLower);
    let contentMatch = false;

    if (note.type === 'note') {
      contentMatch = note.content.toLowerCase().includes(searchLower);
    } else if (note.type === 'todo' && note.todoItems) {
      contentMatch = note.todoItems.some(item => item.text.toLowerCase().includes(searchLower));
    }

    const matchesSearch = titleMatch || contentMatch;
    const matchesColor = colorFilter ? note.color === colorFilter : true;
    const matchesFavorites = showFavorites ? note.isFavorite : true;

    return matchesSearch && matchesColor && matchesFavorites;
  });

  const colorOptions = [
    { name: 'Yellow', class: 'bg-yellow-200' },
    { name: 'Red', class: 'bg-red-200' },
    { name: 'Green', class: 'bg-lime-200' },
    { name: 'Blue', class: 'bg-sky-200' },
    { name: 'Purple', class: 'bg-purple-200' },
    { name: 'Pink', class: 'bg-pink-200' },
    { name: 'Orange', class: 'bg-orange-200' },
    { name: 'Teal', class: 'bg-teal-200' },
    { name: 'Amber', class: 'bg-amber-200' },
    { name: 'Emerald', class: 'bg-emerald-200' },
    { name: 'Indigo', class: 'bg-indigo-200' },
    { name: 'Purple-Blue', class: 'gradient-purple-blue' },
    { name: 'Orange-Red', class: 'gradient-orange-red' },
    { name: 'Green-Blue', class: 'gradient-green-blue' },
    { name: 'Pink-Purple', class: 'gradient-pink-purple' }
  ];

  const toggleColorFilter = (colorClass: string) => {
    if (colorFilter === colorClass) {
      setColorFilter(null);
    } else {
      setColorFilter(colorClass);
      setShowFavorites(false);
    }
  };

  const toggleFavoritesFilter = () => {
    setShowFavorites(!showFavorites);
    setColorFilter(null);
  };

  const favoriteNotes = notes.filter(note => note.isFavorite);

  const toggleNoteViewMode = (noteId: string) => {
    setMarkdownViewMode(prev => {
      const currentMode = prev[noteId] || 'markdown';
      return {
        ...prev,
        [noteId]: currentMode === 'markdown' ? 'plaintext' : 'markdown'
      };
    });
  };

  return (
    <div className={`min-h-screen w-full font-vt323 transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex flex-col h-screen">
        {/* Navbar  */}
        <header className={`sticky top-0 z-40 w-full flex items-center justify-between ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} py-2 px-4 md:px-8 border-b transition-colors`}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            <span className="font-press-start font-bold ml-2 text-base md:text-xl tracking-wide">Note Docket</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className={`md:hidden flex items-center justify-center p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-700'} cursor-pointer transition-colors duration-200`}
              onClick={() => setShowMobileSidebar(true)}
              aria-label="Open sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className={`
                    w-32 md:w-64 px-3 py-2 pl-9 rounded-full border transition-all duration-200 outline-none
                    ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'
                  }
                  `}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full cursor-pointer transition-colors duration-200 focus:ring focus:ring-yellow-400 ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-900'}`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {showMobileSidebar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={() => setShowMobileSidebar(false)}
            ></div>
          )}

          <aside
            className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
              } md:relative md:translate-x-0 ${sidebarExpanded ? 'w-64' : 'w-16'
              } ${isDarkMode ? 'bg-gray-900 border-r border-gray-800 text-gray-100' : 'bg-white border-r border-gray-200 text-gray-900'
              } flex flex-col py-4`}
          >
            <button
              className="md:hidden absolute right-2 top-2 p-1 rounded-full bg-gray-700 text-white"
              onClick={() => setShowMobileSidebar(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <div className={`flex ${sidebarExpanded ? 'px-6 justify-end' : 'justify-center'} items-center mb-10`}>
              {sidebarExpanded && <span className="text-xl font-bold font-press-start text-sm mr-auto">Docket</span>}
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'} cursor-pointer`}
                aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  {sidebarExpanded ? (
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  )}
                </svg>
              </button>
            </div>

            <div className={`mb-8 ${sidebarExpanded ? 'px-6' : 'flex justify-center'}`}>
              <button
                onClick={() => setShowCreateNote(!showCreateNote)}
                className={`${showCreateNote ? 'bg-yellow-500' : 'bg-yellow-400'} ${sidebarExpanded ? 'w-full rounded-full' : 'w-12 h-12 rounded-full'} flex items-center justify-center text-white transition-all duration-200 hover:bg-yellow-500 cursor-pointer`}
                aria-label="Create new note"
              >
                {sidebarExpanded ? (
                  <div className="py-2 px-4 flex items-center font-vt323 text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Note</span>
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            </div>

            <div className={`mb-6 ${sidebarExpanded ? 'px-6' : 'flex flex-col items-center'}`}>
              {sidebarExpanded && <h3 className={`text-xs uppercase font-semibold mb-3 font-press-start ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filter by Color</h3>}
              <div className={`flex ${sidebarExpanded ? 'flex-row flex-wrap gap-2' : 'flex-col gap-3'}`}>
                {colorOptions.map((option) => (
                  <div
                    key={option.class}
                    className={`${option.class.includes('gradient') ?
                      option.class === 'gradient-purple-blue' ? 'bg-gradient-to-br from-purple-300 to-blue-300' :
                        option.class === 'gradient-orange-red' ? 'bg-gradient-to-br from-orange-300 to-red-300' :
                          option.class === 'gradient-green-blue' ? 'bg-gradient-to-br from-emerald-300 to-sky-300' :
                            'bg-gradient-to-br from-pink-300 to-purple-300'
                      : option.class
                      } ${sidebarExpanded ? 'w-8 h-8' : 'w-10 h-10'} rounded-full cursor-pointer ${colorFilter === option.class ? 'ring-2 ring-yellow-400' : ''}`}
                    onClick={() => toggleColorFilter(option.class)}
                    title={option.name}
                  />
                ))}
              </div>
            </div>

            <div className={`mt-4 ${sidebarExpanded ? 'px-6' : 'flex flex-col items-center'}`}>
              <div
                className={`flex ${sidebarExpanded ? 'justify-between' : 'justify-center'} items-center cursor-pointer ${showFavorites ? 'text-yellow-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}
                onClick={toggleFavoritesFilter}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${showFavorites ? 'text-yellow-500 fill-current' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" stroke="currentColor" fill={showFavorites ? 'currentColor' : 'none'}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {sidebarExpanded && <span className="ml-2 font-medium font-vt323 text-lg">Favorites</span>}
                </div>
                {sidebarExpanded && favoriteNotes.length > 0 && (
                  <span className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} text-xs font-medium px-2 py-0.5 rounded-full`}>
                    {favoriteNotes.length}
                  </span>
                )}
              </div>

              {sidebarExpanded && favoriteNotes.length > 0 && (
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {favoriteNotes.map(note => (
                    <div
                      key={note.id}
                      className={`${note.color} rounded-lg p-2 cursor-pointer hover:opacity-90`}
                      onClick={() => startEditingNote(note)}
                    >
                      <p className="text-sm font-medium truncate text-gray-900">{note.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden md:p-8 p-3">
            <div className="flex items-center mb-5">
              <div className="text-3xl font-bold font-press-start mr-auto">Notes</div>
            </div>

            {/* Create Note Form */}
            {showCreateNote && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 mb-8 transition-all duration-300 animate-in fade-in`}>
                <div className={`flex mb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    className={`py-2 px-4 font-medium font-vt323 text-lg ${noteType === 'note' ? 'text-yellow-500 border-b-2 border-yellow-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    onClick={() => setNoteType('note')}
                  >
                    Note
                  </button>
                  <button
                    className={`py-2 px-4 font-medium font-vt323 text-lg ${noteType === 'todo' ? 'text-yellow-500 border-b-2 border-yellow-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    onClick={() => setNoteType('todo')}
                  >
                    To-do List
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Title"
                  className={`w-full mb-2 p-2 text-xl font-semibold focus:outline-none bg-transparent font-vt323 text-2xl ${isDarkMode ? 'placeholder:text-gray-500 text-white' : 'placeholder:text-gray-400 text-gray-900'}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {noteType === 'note' && (
                  <div className="mb-4">
                    <EditorProvider>
                      <Editor
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        containerProps={{
                          style: {
                            resize: 'vertical',
                            color: isDarkMode ? '#d1d5db' : '#111827',
                            fontFamily: '"VT323", monospace',
                            fontSize: '1.2rem',
                            backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                            borderRadius: '0.375rem',
                            padding: '0.5rem'
                          }
                        }}
                        placeholder="Description"
                      />
                    </EditorProvider>
                  </div>
                )}

                {noteType === 'todo' && (
                  <div className="mb-4">
                    {todoItems.map((item, index) => (
                      <div key={item.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleTodoItem(item.id)}
                          className="mr-2 h-5 w-5 text-yellow-500 cursor-pointer"
                          aria-label={`Toggle completion for item ${index + 1}`}
                        />
                        <input
                          type="text"
                          className={`flex-1 p-2 border rounded-md font-vt323 text-lg ${isDarkMode
                              ? 'border-gray-700 bg-gray-700 text-gray-200 placeholder:text-gray-500'
                              : 'border-gray-200 text-gray-900 placeholder:text-gray-400'
                            }`}
                          placeholder={`Item ${index + 1}`}
                          value={item.text}
                          onChange={(e) => updateTodoItem(item.id, e.target.value)}
                          aria-label={`Todo item ${index + 1}`}
                        />
                        <button
                          onClick={() => removeTodoItem(item.id)}
                          className={`ml-2 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} cursor-pointer`}
                          title="Remove item"
                          aria-label="Remove todo item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addTodoItem}
                      className={`mt-2 flex items-center ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} cursor-pointer font-vt323 text-lg`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Item
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 flex-wrap gap-2">
                    {colorOptions.map((option) => (
                      <div
                        key={option.class}
                        className={`w-6 h-6 rounded-full cursor-pointer ${option.class.includes('gradient') ?
                            option.class === 'gradient-purple-blue' ? 'bg-gradient-to-br from-purple-300 to-blue-300' :
                              option.class === 'gradient-orange-red' ? 'bg-gradient-to-br from-orange-300 to-red-300' :
                                option.class === 'gradient-green-blue' ? 'bg-gradient-to-br from-emerald-300 to-sky-300' :
                                  'bg-gradient-to-br from-pink-300 to-purple-300'
                            : option.class
                          } ${color === option.class ? 'ring-2 ring-yellow-400' : ''}`}
                        onClick={() => setColor(option.class)}
                        title={option.name}
                      />
                    ))}
                  </div>
                  <button
                    onClick={addNote}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-vt323 text-lg cursor-pointer"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            )}

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="relative transition-transform duration-200 ease-in-out h-full hover:scale-105"
                  onClick={() => startEditingNote(note)}
                >
                  <NoteBackground color={note.color}>
                    <div className="p-4 h-full text-gray-900 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center pt-1 space-x-2">
                          {note.type === 'todo' && (
                            <span className={`inline-flex items-center rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-2 py-0.5 text-xs font-medium`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                              List
                            </span>
                          )}
                          {note.type === 'note' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleNoteViewMode(note.id); }}
                              className="p-1 rounded-full bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 text-current hover:bg-opacity-20 dark:hover:bg-opacity-20 text-xs cursor-pointer"
                              aria-label="Toggle view mode"
                              title={markdownViewMode[note.id] === 'plaintext' ? 'Show Rendered' : 'Show Plain Text'}
                            >
                              {markdownViewMode[note.id] === 'plaintext' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                              )}
                            </button>
                          )}
                        </div>
                        <div
                          className="cursor-pointer flex-shrink-0"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            toggleFavorite(note.id);
                          }}
                        >
                          {note.isFavorite ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 fill-current" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                          )}
                        </div>
                      </div>

                      <h3 className="font-press-start text-md mb-2 flex-shrink-0">{note.title}</h3>

                      <div className="flex-grow mb-4 overflow-hidden">
                        {note.type === 'note' && (
                          markdownViewMode[note.id] === 'plaintext' ? (
                            <pre className="whitespace-pre-wrap text-sm font-vt323 text-xl" style={{ color: 'inherit' }}>
                              {note.content}
                            </pre>
                          ) : (
                            <div 
                              className="prose prose-sm max-w-none dark:prose-invert font-vt323 text-lg" 
                              style={{ color: 'inherit' }}
                              dangerouslySetInnerHTML={{ __html: prepareContentForDisplay(note.content) }}
                            />
                          )
                        )}
                        {note.type === 'todo' && note.todoItems && (
                          <ul className="space-y-1 font-vt323 text-lg">
                            {note.todoItems.map(item => (
                              <li key={item.id} className={`flex items-center ${item.completed ? 'line-through opacity-70' : ''}`}>
                                <span className="mr-2 flex-shrink-0">
                                  {item.completed ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  )}
                                </span>
                                <span className="truncate">{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-auto pt-2 border-t border-black border-opacity-10 dark:border-white dark:border-opacity-10 flex-shrink-0">
                        <span className="text-xs opacity-70 font-vt323">{note.date}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); startEditingNote(note); }}
                            className="p-1 rounded-full bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 text-current hover:bg-opacity-20 dark:hover:bg-opacity-20 cursor-pointer"
                            aria-label="Edit note"
                            title="Edit note"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteNote(note.id); }}
                            className="p-1 rounded-full bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 text-current hover:bg-opacity-20 dark:hover:bg-opacity-20 cursor-pointer"
                            aria-label="Delete note"
                            title="Delete note"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </NoteBackground>
                </div>
              ))}
            </div>

            <footer className={`w-full mt-auto ${isDarkMode ? 'bg-gray-900 text-gray-400 border-t border-gray-800' : 'bg-white text-gray-600 border-t border-gray-200'} py-4 px-3 text-center text-xs md:text-base transition-all duration-300 font-vt323`}>
              <span className="font-press-start">Note Docket</span>
              <span className="mx-2">•</span>
              <span>© {new Date().getFullYear()} All rights reserved. Productive &amp; Playful Notes App.</span>
            </footer>
          </main>
        </div>
      </div>

      {/* Modals */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div
            className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl w-full max-w-lg z-50 transform transition-all duration-300 ease-out animate-in fade-in`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-vt323 text-lg`}>
                  {editingNote.type === 'note' && 'Note'}
                  {editingNote.type === 'todo' && 'To-do List'}
                </span>
                <button
                  onClick={() => setEditingNote(null)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} cursor-pointer`}
                  title="Close editor"
                  aria-label="Close editor"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <input
                type="text"
                className={`w-full mb-4 p-2 text-xl font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg font-vt323 text-2xl ${isDarkMode ? 'placeholder:text-gray-500 text-white' : 'placeholder:text-gray-400 text-gray-900'
                  }`}
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                aria-label="Edit note title"
                placeholder="Title"
              />

              {editingNote.type === 'note' && (
                <div className="mb-4">
                  <EditorProvider>
                    <Editor
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                      containerProps={{
                        style: {
                          resize: 'vertical',
                          color: isDarkMode ? '#d1d5db' : '#111827',
                          fontFamily: '"VT323", monospace',
                          fontSize: '1.2rem',
                          backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                          borderRadius: '0.375rem',
                          padding: '0.5rem'
                        }
                      }}
                      placeholder="Description"
                    />
                  </EditorProvider>
                </div>
              )}

              {editingNote.type === 'todo' && editingNote.todoItems && (
                <div className="mb-4">
                  {editingNote.todoItems.map((item, index) => (
                    <div key={item.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {
                          const todoItems = [...(editingNote.todoItems || [])];
                          if (todoItems[index]) {
                            todoItems[index] = {
                              ...todoItems[index],
                              completed: !todoItems[index].completed
                            };
                            setEditingNote({ ...editingNote, todoItems });
                          }
                        }}
                        className="mr-2 h-5 w-5 text-yellow-500 cursor-pointer"
                        aria-label={`Toggle completion for item ${index + 1}`}
                      />
                      <input
                        type="text"
                        className={`flex-1 p-2 border rounded-md font-vt323 text-lg ${isDarkMode
                            ? 'border-gray-700 bg-gray-700 text-gray-200'
                            : 'border-gray-200 text-gray-900'
                          }`}
                        placeholder={`Item ${index + 1}`}
                        value={item.text}
                        onChange={(e) => {
                          const todoItems = [...(editingNote.todoItems || [])];
                          if (todoItems[index]) {
                            todoItems[index] = {
                              ...todoItems[index],
                              text: e.target.value
                            };
                            setEditingNote({ ...editingNote, todoItems });
                          }
                        }}
                        aria-label={`Edit item ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const todoItems = editingNote.todoItems || [];
                          if (todoItems.length > 1) {
                            const updatedItems = todoItems.filter(
                              (_, i) => i !== index
                            );
                            setEditingNote({ ...editingNote, todoItems: updatedItems });
                          }
                        }}
                        className={`ml-2 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} cursor-pointer`}
                        disabled={!editingNote.todoItems || editingNote.todoItems.length <= 1}
                        title="Remove item"
                        aria-label="Remove todo item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${!editingNote.todoItems || editingNote.todoItems.length <= 1 ? 'opacity-50' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      if (editingNote.todoItems) {
                        setEditingNote({
                          ...editingNote,
                          todoItems: [
                            ...editingNote.todoItems,
                            { id: Date.now().toString(), text: '', completed: false }
                          ]
                        });
                      }
                    }}
                    className={`mt-2 flex items-center ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} font-vt323 text-lg cursor-pointer`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Item
                  </button>
                </div>
              )}

              <div className="mb-4">
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2 font-vt323 text-lg`}>Color</h4>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((option) => (
                    <div
                      key={option.class}
                      className={`w-6 h-6 rounded-full cursor-pointer ${option.class.includes('gradient') ?
                          option.class === 'gradient-purple-blue' ? 'bg-gradient-to-br from-purple-300 to-blue-300' :
                            option.class === 'gradient-orange-red' ? 'bg-gradient-to-br from-orange-300 to-red-300' :
                              option.class === 'gradient-green-blue' ? 'bg-gradient-to-br from-emerald-300 to-sky-300' :
                                'bg-gradient-to-br from-pink-300 to-purple-300'
                          : option.class
                        } ${editingNote.color === option.class ? 'ring-2 ring-yellow-400' : ''}`}
                      onClick={() => setEditingNote({ ...editingNote, color: option.class })}
                      title={option.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setEditingNote(null)}
                  className={`px-4 py-2 rounded-lg ${isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors duration-200 font-vt323 text-lg cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  onClick={updateNote}
                  className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 font-vt323 text-lg cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {noteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md z-50 transform transition-all duration-300 ease-out animate-in fade-in`}>
            <h3 className={`text-lg font-semibold mb-3 font-press-start ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Delete Note</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 font-vt323 text-lg`}>Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setNoteToDelete(null)}
                className={`px-4 py-2 rounded-lg ${isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-200 font-vt323 text-lg cursor-pointer`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 font-vt323 text-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Keep;