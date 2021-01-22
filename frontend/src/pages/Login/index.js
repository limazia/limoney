import React, { useState } from "react";
import { toast } from "react-toastify";
import { Form } from "@rocketseat/unform";
import { useHistory, Link } from "react-router-dom";

import api from "../../services/api";
import { login } from "../../services/auth";

import "./styles.css";

export default function Login() {
  document.title = `${process.env.REACT_APP_NAME} - Login`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  async function handleSubmit() {
    if (!email || !password) {
      toast.error("Preencha e-mail e senha para continuar!");
    } else {
      try {
        setLoading(true);
        const response = await api.post("/api/auth/login", { email, password });
        const { token, error, message } = response.data;

        if (token) {
          login(token);
          history.push("./dashboard");
        } else {
          if (message) {
            toast.success(message);
          } else {
            toast.error(error);
          }
        }
      } catch (err) {
        toast.error("Houve um problema com o servidor!");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="container h-100">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="card login-card">
          <div className="card-body">
            <h4 className="card-title">Iniciar sessão</h4>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group m-0">
                <button
                  type="submit"
                  disabled={!email || !password || password.length <= 3 ? true : false}
                  className="btn btn-login btn-block"
                >
                  {loading ? (
                    <div
                      className="spinner-border"
                      role="status"
                      style={{
                        marginBottom: 2,
                        width: "0.9rem",
                        height: "0.9rem",
                      }}
                    ></div>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
              <div className="mt-4 text-center">
                Não tem conta? <Link to="./register">Crie uma</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
