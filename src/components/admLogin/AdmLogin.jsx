import "./AdmLogin.css";
import Logo from '../../assets/logo_g.png'
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { api } from "../../apiService/ApiService.js";

function AdmLogin() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  console.log(email);
    try {
      const response = await api.post("/admlogin", { email });
      setStep(2);
    
      alert(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao enviar email");
    } finally {
      setLoading(false);
    }
  };

  const handleToken = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admtoken", { email, token });

      //salva token no localStorage
      localStorage.setItem("token", response.data.token);

      // Configura o token como default nas requisições
      api.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.token}`;

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Token inválido");
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <main className="containerLogin">
        <div className="contentLogo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="contentInput">
          <form onSubmit={handleEmail} className="form">
            <label htmlFor="login">Login</label>
            <input
              id="login"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
            {error && <div className="errorLogin">{error}</div>}
            <button>{loading ? "Enviando..." : "Enviar"}</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="containerLogin">
      <div className="contentLogo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="contentInput">
        <form onSubmit={handleToken} className="form">
          <label htmlFor="token">Token</label>
          <input
            id="token"
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Digite o token recebido no email"
          />
          {error && <div className="errorLogin">{error}</div>}
          <button>{loading ? "Validando token..." : "Enviar"}</button>
        </form>
      </div>
    </main>
  );
}
export default AdmLogin;
