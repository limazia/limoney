import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Form } from '@rocketseat/unform';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import Loading from '../../components/Loading';
import Header from '../../components/Header';

import './styles.css';

export default function Settings() {
  document.title = `${process.env.REACT_APP_NAME} - Configurações`;
  document.body.style.overflowY = "auto";
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const history = useHistory();

  useEffect(() => {
    loadInfo();

    setTimeout(() => {
      setLoadingPage(false);
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadInfo() {
    try {
      const { data: { id } } = await api.get("api/auth/session");
      const { data } = await api.get(`api/users/${id}`);
      const { email, name } = data;

      setEmail(email);
      setName(name);
    } catch (err) {
      toast.error("Erro ao buscar dados");
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const { data } = await api.put("/api/users", {
        email,
        name,
        password,
        newPassword,
        confirmNewPassword,
      });
      const { error, message } = data;
      console.log(error, message);

      if (message) {
        toast.success(message);
        history.push("../dashboard");
      } else {
        toast.error(error);
      }
    } catch (err) {
      toast.error("Houve um problema ao atualizar sua conta.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loadingPage ? (
        <Loading />
      ) : (
        <>
          <Header />
          <div className="container-fluid mt-5 mb-5">
            <div
              className="row h-100 justify-content-center align-items-center"
              style={{ paddingBottom: "3rem" }}
            >
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="text-right">Editar perfil</h4>
                    </div>
                    <Form onSubmit={handleSubmit} autoComplete="off">
                      <div className="row mt-2">
                        <div className="col-md-6">
                          <label className="labels">Nome</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Digite seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="labels">Email</label>
                          <input
                            type="text"
                            name="email"
                            className="form-control"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-12">
                          <label className="labels">Senha antiga</label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Digite sua senha atual"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <label className="labels">Senha nova</label>
                          <input
                            type="password"
                            name="newpassword"
                            className="form-control"
                            placeholder="Digite sua nova senha"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="labels">Confirme a senha</label>
                          <input
                            type="password"
                            name="confirmnewpassword"
                            className="form-control"
                            placeholder="Confirme sua nova senha"
                            value={confirmNewPassword}
                            onChange={(e) =>
                              setConfirmNewPassword(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-5 text-center">
                        <button
                          type="submit"
                          className="btn btn-block btn-update mb-4"
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
                            "Atualizar"
                          )}
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
