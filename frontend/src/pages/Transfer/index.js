import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Form } from '@rocketseat/unform';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

import api from '../../services/api';

import Loading from '../../components/Loading';
import Header from '../../components/Header';

import './styles.css';

export default function Transfer() {
  const { id } = useParams();

  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [infoTo, setInfoTo] = useState([]);
  const [infoFrom, setInfoFrom] = useState([]);

  const history = useHistory();

  useEffect(() => {
    loadInfoTo();
    loadInfoFrom();

    setTimeout(() => {
      setLoadingPage(false);
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadInfoTo() {
    try {
      const { data } = await api.get("api/auth/session");
      const getDetails = await api.get(`api/users/${data.id}`);

      if (data.id === id) {
        toast.error("Você não pode fazer uma transferência para si mesmo");
        history.push("../dashboard");
      } else {
        setInfoTo(getDetails.data);
      }
    } catch (err) {
      toast.error("Erro ao buscar Informações do seu perfil");
    }
  }

  async function loadInfoFrom() {
    try {
      const { data } = await api.get(`api/users/${id}`);
      setInfoFrom(data);
    } catch (err) {
      toast.error("Erro ao buscar Informações do perfil");
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const { data } = await api.post("/api/transfer", {
        transfer_id: infoFrom.id,
        transfer_value: value,
      });
      const { error, message } = data;

      if (message) {
        const valueCurrency = parseInt(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        toast.success(`Você enviou ${valueCurrency} para ${infoFrom.name}`);
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

  document.title = `${process.env.REACT_APP_NAME} - Transferir para ${infoFrom.name}`;
  document.body.style.overflowY = "auto";
  return (
    <>
      {loadingPage ? (
        <Loading />
      ) : (
        <>
          <Header />
          <div className="container mt-5 pb-5">
            <div className="row">
              <div class="col-md-4">
                <div class="card-box bg-green">
                  <div class="inner">
                    <h3>Sua carteira</h3>
                    <small>
                      Saldo:{" "}
                      {infoTo.points.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <h5 class="card-title">
                      Transferir para <b>{infoFrom.name}</b>
                    </h5>
                    <Form onSubmit={handleSubmit} autoComplete="off">
                      <div className="row mt-2">
                        <div className="col-md-12">
                          <label className="labels">Valor</label>
                          <input
                            type="number"
                            name="transfer_value"
                            className="form-control"
                            placeholder="Digite um valor"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <button
                          type="submit"
                          disabled={!value || value === "0" ? true : false}
                          className="btn btn-block btn-send-transfer mb-4"
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
                            "Enviar transferência"
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
