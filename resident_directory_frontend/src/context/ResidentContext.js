import React, { createContext, useContext, useReducer, useEffect } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'resident_directory_data';

// Sample seed data for initial load
const SEED_RESIDENTS = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    unit: '101',
    floor: '1',
    building: 'A',
    email: 'alice.johnson@example.com',
    phone: '555-0101',
    moveInDate: '2022-01-15',
    tags: ['pet-owner', 'long-term'],
    notes: 'Has a golden retriever named Max.',
    avatar: '',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    unit: '205',
    floor: '2',
    building: 'A',
    email: 'bob.smith@example.com',
    phone: '555-0102',
    moveInDate: '2021-06-01',
    tags: ['parking'],
    notes: '',
    avatar: '',
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Williams',
    unit: '310',
    floor: '3',
    building: 'B',
    email: 'carol.w@example.com',
    phone: '555-0103',
    moveInDate: '2023-03-20',
    tags: ['pet-owner', 'balcony'],
    notes: 'Two cats.',
    avatar: '',
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Brown',
    unit: '412',
    floor: '4',
    building: 'B',
    email: 'david.brown@example.com',
    phone: '555-0104',
    moveInDate: '2020-11-30',
    tags: ['long-term', 'parking'],
    notes: '',
    avatar: '',
  },
  {
    id: '5',
    firstName: 'Eva',
    lastName: 'Davis',
    unit: '501',
    floor: '5',
    building: 'C',
    email: 'eva.davis@example.com',
    phone: '555-0105',
    moveInDate: '2024-01-10',
    tags: ['balcony'],
    notes: 'Recently moved in.',
    avatar: '',
  },
];

// ─── Initial State ────────────────────────────────────────────────────────────
const getInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return {
    residents: SEED_RESIDENTS,
    filters: {
      building: '',
      floor: '',
      unit: '',
      tags: [],
    },
    searchQuery: '',
    sortField: 'lastName',
    sortDirection: 'asc',
  };
};

// ─── Action Types ─────────────────────────────────────────────────────────────
export const ACTION_TYPES = {
  ADD_RESIDENT: 'ADD_RESIDENT',
  UPDATE_RESIDENT: 'UPDATE_RESIDENT',
  DELETE_RESIDENT: 'DELETE_RESIDENT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_SEARCH: 'SET_SEARCH',
  SET_SORT: 'SET_SORT',
  IMPORT_RESIDENTS: 'IMPORT_RESIDENTS',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function residentReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_RESIDENT: {
      const newResident = {
        ...action.payload,
        id: Date.now().toString(),
      };
      return { ...state, residents: [...state.residents, newResident] };
    }
    case ACTION_TYPES.UPDATE_RESIDENT: {
      return {
        ...state,
        residents: state.residents.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };
    }
    case ACTION_TYPES.DELETE_RESIDENT: {
      return {
        ...state,
        residents: state.residents.filter((r) => r.id !== action.payload),
      };
    }
    case ACTION_TYPES.SET_FILTER: {
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    }
    case ACTION_TYPES.CLEAR_FILTERS: {
      return {
        ...state,
        filters: { building: '', floor: '', unit: '', tags: [] },
        searchQuery: '',
      };
    }
    case ACTION_TYPES.SET_SEARCH: {
      return { ...state, searchQuery: action.payload };
    }
    case ACTION_TYPES.SET_SORT: {
      return {
        ...state,
        sortField: action.payload.field,
        sortDirection: action.payload.direction,
      };
    }
    case ACTION_TYPES.IMPORT_RESIDENTS: {
      return { ...state, residents: action.payload };
    }
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ResidentContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * ResidentProvider - Provides global resident state with localStorage persistence.
 * Wraps the app to make resident data, filters, sorting, and dispatch available
 * throughout the component tree.
 */
export function ResidentProvider({ children }) {
  const [state, dispatch] = useReducer(residentReducer, null, getInitialState);

  // Persist state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [state]);

  return (
    <ResidentContext.Provider value={{ state, dispatch }}>
      {children}
    </ResidentContext.Provider>
  );
}

// PUBLIC_INTERFACE
/**
 * useResidents - Custom hook to access the resident context.
 * Returns { state, dispatch } from the ResidentContext.
 */
export function useResidents() {
  const ctx = useContext(ResidentContext);
  if (!ctx) {
    throw new Error('useResidents must be used within a ResidentProvider');
  }
  return ctx;
}

// PUBLIC_INTERFACE
/**
 * useFilteredResidents - Returns residents after applying search, filters, and sorting.
 */
export function useFilteredResidents() {
  const { state } = useResidents();
  const { residents, filters, searchQuery, sortField, sortDirection } = state;

  let result = [...residents];

  // Apply search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (r) =>
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.unit.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q) ||
        (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  // Apply filters
  if (filters.building) {
    result = result.filter((r) => r.building === filters.building);
  }
  if (filters.floor) {
    result = result.filter((r) => r.floor === filters.floor);
  }
  if (filters.unit) {
    result = result.filter((r) => r.unit === filters.unit);
  }
  if (filters.tags && filters.tags.length > 0) {
    result = result.filter(
      (r) => r.tags && filters.tags.every((t) => r.tags.includes(t))
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    const valA = (a[sortField] || '').toString().toLowerCase();
    const valB = (b[sortField] || '').toString().toLowerCase();
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return result;
}

export default ResidentContext;
