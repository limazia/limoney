import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";

import Loading from "../../components/Loading";
import Header from "../../components/Header";

import "./styles.css";

export default function History() {
  document.title = `${process.env.REACT_APP_NAME} - Histórico de transferência`;
  document.body.style.overflowY = "auto";

  const [history, setHistory] = useState([]);
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInfo();
    loadHistory();

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadInfo() {
    try {
      const {
        data: { id },
      } = await api.get("api/auth/session");
      const { data } = await api.get(`api/users/${id}`);
      setInfo(data);
    } catch (err) {
      toast.error("Erro ao buscar Informações do perfil");
    }
  }

  async function loadHistory() {
    try {
      const {
        data: { id },
      } = await api.get("api/auth/session");
      const { data } = await api.get(`api/transfers/${id}`);

      setHistory(data);
    } catch (err) {
      toast.error("Erro ao buscar Informações do perfil");
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Header />
          <div className="container mt-5 pb-5">
            <div className="row">
              <div className="col-md-12">
                <h1>Histórico de transferência</h1>
                {history.length >= 1 ? (
                  <table
                    className="table table-bordered text-center"
                    style={{ borderRadius: 5 }}
                  >
                    <thead>
                      <tr>
                        <th>Transferência</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => {
                        if (info.name === item.history_from) {
                          return (
                            <tr key={item.history_id}>
                              <td>
                                <b>Você</b> enviou{" "}
                                <b className="text-danger">
                                  -{item.history_value.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </b>{" "}
                                para <b>{item.history_to}</b>
                              </td>
                              <td>{item.createdAt}</td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={item.history_id}>
                              <td>
                                <b>Você</b> recebeu{" "}
                                <b className="text-success">
                                  +{item.history_value.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </b>{" "}
                                de <b>{item.history_from}</b>
                              </td>
                              <td>{item.createdAt}</td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div class="alert alert-danger" role="alert">
                    Nenhum histórico de transferência encontrado.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
