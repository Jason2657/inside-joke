"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { MatchResult, Reaction, UserProfile } from "./types";

type Status = "idle" | "loading" | "error";

type State = {
  profile: UserProfile | null;
  reactions: Record<string, Reaction>;
  matchResult: MatchResult | null;
  status: Status;
  error: string | null;
};

type Action =
  | { type: "SET_PROFILE"; profile: UserProfile }
  | { type: "SET_REACTION"; memeId: string; reaction: Reaction }
  | { type: "SET_STATUS"; status: Status; error?: string | null }
  | { type: "SET_MATCH"; result: MatchResult }
  | { type: "RESET" };

const initialState: State = {
  profile: null,
  reactions: {},
  matchResult: null,
  status: "idle",
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: action.profile };
    case "SET_REACTION":
      return {
        ...state,
        reactions: { ...state.reactions, [action.memeId]: action.reaction },
      };
    case "SET_STATUS":
      return { ...state, status: action.status, error: action.error ?? null };
    case "SET_MATCH":
      return {
        ...state,
        matchResult: action.result,
        status: "idle",
        error: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
