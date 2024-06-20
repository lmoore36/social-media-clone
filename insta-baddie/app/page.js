import { login, signup } from "@/lib/actions/auth";
import "./login-style.css"; // Import the CSS file

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Welcome to my social media clone project!</h2>
        <p className="login-description">Please log in or sign up to continue.</p>
        <form>
          <div className="input-group">
            <label className="login-label" htmlFor="email">Email:</label>
            <input className="login-input" id="email" name="email" type="email" required />
          </div>
          <div className="input-group">
            <label className="login-label" htmlFor="password">Password:</label>
            <input className="login-input" id="password" name="password" type="password" required />
          </div>
          <div className="login-button-group">
            <button className="login-button" formAction={login}>Log in</button>
            <button className="login-button" formAction={signup}>Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}