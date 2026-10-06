// Shared layout for Login and Signup pages.
// Left: brand panel. Right: the form (passed in as children).
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <div className="brand-logo">
          <div className="brand-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          Chatly
        </div>

        <div className="brand-body">
          <h1>Conversations that feel instant.</h1>
          <p>
            Stay connected with your people through fast, real-time messaging.
          </p>
          <ul className="brand-features">
            <li><span className="dot"><CheckIcon /></span>Real-time messaging</li>
            <li><span className="dot"><CheckIcon /></span>See who is online</li>
            <li><span className="dot"><CheckIcon /></span>Typing indicators</li>
            <li><span className="dot"><CheckIcon /></span>Secure, private conversations</li>
          </ul>
        </div>

        <div className="brand-footer">© 2026 Chatly. All rights reserved.</div>
      </aside>

      <main className="auth-form-side">
        <div className="auth-card">
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          <p className="auth-switch">{footer}</p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;