import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Form } from '@rocketseat/unform';
import { useHistory, Link } from 'react-router-dom';

import api from '../../services/api';

import './styles.css';

export default function Register() {
  document.title = `${process.env.REACT_APP_NAME} - Criar conta`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  async function handleSubmit() {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        confirmpassword: confirmPassword,
      });
      const { error, message } = response.data;

      if (message) {
        toast.success(message);
        history.push("../");
      } else {
        toast.error(error);
      }
    } catch (err) {
      toast.error("Houve um problema ao criar a sua conta.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container h-100">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="card register-card">
          <div className="card-body">
            <h4 className="card-title">Criar conta</h4>
            <Form
              //schema={schema}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
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
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              <div className="form-group">
                <input
                  type="password"
                  name="confirmpassword"
                  className="form-control"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="form-group m-0">
                <button
                  type="submit"
                  disabled={
                    !name ||
                    !email ||
                    !password ||
                    !confirmPassword ||
                    password.length <= 3 ||
                    confirmPassword.length <= 3
                      ? true
                      : false
                  }
                  className="btn btn-register btn-block"
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
                    "Cadastre-se"
                  )}
                </button>
              </div>
              <div className="mt-4 text-center">
                Já tem conta? <Link to="../">Faça login</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}