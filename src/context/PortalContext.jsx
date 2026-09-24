import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_GROUPS, INITIAL_SESSIONS } from '../data/seedData.js';
import { USER_ROLES } from '../data/models.js';
import { transitionSessionState } from '../services/sessionLifecycle.js';

const PortalContext = createContext(null);

const STORAGE_KEYS = {
  GROUPS: 'eco_portal_groups_v2',
  SESSIONS: 'eco_portal_sessions_v2',
  ROLE: 'eco_portal_role_v2',
};

export function PortalProvider({ children }) {
  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
      return saved ? JSON.parse(saved) : INITIAL_GROUPS;
    } catch {
      return INITIAL_GROUPS;
    }
  });

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return saved || USER_ROLES.FINANCE_OFFICER;
    } catch {
      return USER_ROLES.FINANCE_OFFICER;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    } catch (err) {
      console.error('Failed to save groups to localStorage:', err);
    }
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (err) {
      console.error('Failed to save sessions to localStorage:', err);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
    } catch (err) {
      console.error('Failed to save role to localStorage:', err);
    }
  }, [currentRole]);

  // Group Management Actions
  const addGroup = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
  };

  const updateGroup = (groupId, updatedData) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...updatedData } : g))
    );
  };

  const toggleGroupStatus = (groupId) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isActive: !g.isActive } : g))
    );
  };

  const toggleBranchStatus = (groupId, branchId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          branches: g.branches.map((b) =>
            b.id === branchId ? { ...b, isActive: !b.isActive } : b
          ),
        };
      })
    );
  };

  const updateBranch = (groupId, branchId, updatedBranchData) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          branches: g.branches.map((b) =>
            b.id === branchId ? { ...b, ...updatedBranchData } : b
          ),
        };
      })
    );
  };

  // Session Management Actions
  const createSession = (newSession) => {
    setSessions((prev) => [newSession, ...prev]);

    // Mark the period in the group as having an active session (BR01)
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== newSession.groupId) return g;
        return {
          ...g,
          periods: g.periods.map((p) =>
            p.id === newSession.periodId ? { ...p, hasActiveSession: true } : p
          ),
        };
      })
    );
  };

  const executeSessionTransition = (sessionId, actionKey) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return { success: false, error: 'Phiên không tồn tại' };

    const result = transitionSessionState(session, actionKey, currentRole);
    if (result.success) {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? result.updatedSession : s))
      );

      // If cancelled, free up period active session status if no other active sessions exist
      if (result.updatedSession.status === 'CANCELLED') {
        const remainingActive = sessions.some(
          (s) =>
            s.id !== sessionId &&
            s.groupId === session.groupId &&
            s.periodId === session.periodId &&
            s.status !== 'CANCELLED'
        );
        if (!remainingActive) {
          setGroups((prev) =>
            prev.map((g) => {
              if (g.id !== session.groupId) return g;
              return {
                ...g,
                periods: g.periods.map((p) =>
                  p.id === session.periodId ? { ...p, hasActiveSession: false } : p
                ),
              };
            })
          );
        }
      }
    }
    return result;
  };

  const createArrearsSession = (parentSessionId, arrearsData) => {
    setSessions((prev) => {
      // Mark parent session as having arrears
      const updated = prev.map((s) =>
        s.id === parentSessionId ? { ...s, arrearsStatus: 'HAS_ARREARS' } : s
      );
      return [arrearsData, ...updated];
    });
  };

  const resetToDefaultSeed = () => {
    setGroups(INITIAL_GROUPS);
    setSessions(INITIAL_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  };

  return (
    <PortalContext.Provider
      value={{
        groups,
        sessions,
        currentRole,
        setCurrentRole,
        addGroup,
        updateGroup,
        toggleGroupStatus,
        toggleBranchStatus,
        updateBranch,
        createSession,
        executeSessionTransition,
        createArrearsSession,
        resetToDefaultSeed,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
