import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

function LoginArtwork() {
  return <svg className="login-artwork-svg" viewBox="0 0 440 260" role="img" aria-labelledby="login-art-title login-art-desc"><title id="login-art-title">{"A citizen approves Jan Setu sign-in on WhatsApp"}</title><desc id="login-art-desc">{"A citizen, phone, confirmation buttons and tracked complaint ticket connected in one secure flow."}</desc><path className="login-artwork-svg__ground" d="M52 218c65 20 253 23 337-1" /><circle className="login-artwork-svg__sun" cx="66" cy="51" r="28" /><path className="login-artwork-svg__building" d="M292 78h90v136h-90zM307 101h18v18h-18zM348 101h18v18h-18zM307 137h18v18h-18zM348 137h18v18h-18zM322 181h29v33h-29z" /><g className="login-artwork-svg__person"><circle cx="104" cy="123" r="24" /><path d="M65 215c3-48 18-70 39-70s36 22 39 70" /><path d="m133 167 52 26" /></g><g className="login-artwork-svg__phone"><rect x="170" y="59" width="88" height="161" rx="20" /><rect x="181" y="78" width="66" height="112" rx="8" /><path d="M205 204h18" /></g><g className="login-artwork-svg__message"><path d="M197 96h34a8 8 0 0 1 8 8v19a8 8 0 0 1-8 8h-17l-9 9v-9h-8a8 8 0 0 1-8-8v-19a8 8 0 0 1 8-8z" /><path d="m199 113 7 7 19-19" /></g><g className="login-artwork-svg__pin"><path d="M278 32c19 0 32 14 32 31 0 22-32 49-32 49s-32-27-32-49c0-17 13-31 32-31z" /><circle cx="278" cy="63" r="10" /></g><g className="login-artwork-svg__ticket"><rect x="272" y="147" width="115" height="62" rx="13" /><path d="M289 166h55M289 180h39" /><circle cx="367" cy="178" r="10" /><path d="m362 178 4 4 7-8" /></g></svg>;
}

export default function Login() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (phone.trim()) setSubmitted(true);
  };

  return <main className="login-screen">
    <section className="login-story">
      <Link className="login-story__about" to="/about">{"How Jan Setu works \u2192"}</Link>
      <div className="login-story__copy">
        <span className="app-kicker">{"Jan Setu"}</span>
        <h2>{"File a civic complaint from your phone"}</h2>
        <p>{"Report a problem, track what happens next, and get a receipt you can keep."}</p>
      </div>
      <div className="login-artwork"><LoginArtwork /></div>
    </section>
    <section className="login-form-panel">
      {!submitted ? <form className="login-form" onSubmit={submit}>
        <div>
          <span className="app-kicker">{"Citizen sign in"}</span>
          <h1 id="sign-in-title">{"Use your WhatsApp number"}</h1>
          <p>{"We will confirm it on WhatsApp so nobody else can file in your name."}</p>
        </div>
        <label htmlFor="login-phone">{"WhatsApp number"}</label>
        <input id="login-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel"
          value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91" />
        <button className="app-button app-button--teal" type="submit" disabled={!phone.trim()}>
          {"Continue \u2192"}
        </button>
        <small>{"Sign-in is not wired to the backend yet."}</small>
      </form> : <section className="login-form otp-panel" aria-live="polite">
        <div>
          <span className="app-kicker">{"Almost there"}</span>
          <h1>{"Check WhatsApp"}</h1>
          <p>{"Verification will be delivered here once the auth API is connected."}</p>
        </div>
        <button type="button" className="otp-change-number" onClick={() => setSubmitted(false)}>
          {"Use another number"}
        </button>
      </section>}
    </section>
  </main>;
}
