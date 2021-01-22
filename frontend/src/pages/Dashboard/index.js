import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Loading from '../../components/Loading';
import Header from '../../components/Header';

import './styles.css';

export default function Dashboard() {
  document.title = `${process.env.REACT_APP_NAME} - Dashboard`;
  document.body.style.overflowY = "auto";

  const [users, setUsers] = useState([]);
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    loadInfo();

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUsers(page = 1) {
    try {
      const { data } = await api.get("/api/users");

      if (data) {
        setUsers(data);
      }
    } catch (err) {
      toast.error("Erro ao carregar os usuários!");
    }
  }
 
  async function loadInfo() {
    try {
      const { data } = await api.get("api/auth/session");
      const getDetails = await api.get(`api/users/${data.id}`);

      setInfo(getDetails.data);
    } catch (err) {
      toast.error("Erro ao buscar Informações do seu perfil");
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
                <h1>Lista de usuários</h1>
                <table
                  className="table table-bordered text-center"
                  style={{ borderRadius: 5 }}
                >
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Saldo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>
                          {user.balance.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td>
                          {user.id !== info.id ? (
                            <Link to={`./${user.id}/transfer`}>
                              Enviar transferência
                            </Link>
                          ) : (
                            <i
                              className="fas fa-question-circle"
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Você não pode fazer uma transferência para si mesmo"
                            ></i>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}