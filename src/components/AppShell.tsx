import type { ReactNode } from 'react';

type AppShellProps = {
  selectedRole: 'customer' | 'manager';
  selectedUserId: string;
  users: Array<{ id: string; name: string; role: string; zone: string }>;
  loggedUser: { name: string; zone: string };
  onRoleChange: (role: 'customer' | 'manager') => void;
  onUserChange: (userId: string) => void;
  children: ReactNode;
};

export function AppShell({
  selectedRole,
  selectedUserId,
  users,
  loggedUser,
  onRoleChange,
  onUserChange,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Root & Bloom</p>
          <h1>Digital Business System</h1>
        </div>
        <div className="role-switch">
          <button className={selectedRole === 'customer' ? 'active' : ''} onClick={() => onRoleChange('customer')}>
            Customer View
          </button>
          <button className={selectedRole === 'manager' ? 'active' : ''} onClick={() => onRoleChange('manager')}>
            Manager View
          </button>
        </div>
      </header>

      <section className="login-bar">
        <label>
          Logged in as
          <select value={selectedUserId} onChange={(event) => onUserChange(event.target.value)}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </label>
        <div className="user-meta">
          <strong>{loggedUser.name}</strong>
          <span>{loggedUser.zone}</span>
        </div>
      </section>

      {children}
    </div>
  );
}
