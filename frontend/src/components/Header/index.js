import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
//import { toast } from 'react-toastify';
//import socketio from 'socket.io-client';

import api from '../../services/api';
import { logout } from '../../services/auth';

import './styles.css';

function Header() {
  const [info, setInfo] = useState([]);

  const history = useHistory();
  const href = "#";

  useEffect(() => {
    loadInfo();

    /*
    const socket = socketio(process.env.REACT_APP_SOCKET_URL);

    socket.on("transferWarning", (data) => {
      if (info.name === data.userTo) {
        toast.success(`Você recebeu uma transferência de ${data.userFrom}`);
        return () => socket.disconnect();
      }
    });
    */
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);

  async function loadInfo() {
    const getSession = await api.get("api/auth/session");
    const { id, error } = getSession.data;

    const getDetails = await api.get(`api/users/${id}`);
    setInfo(getDetails.data);

    if (error) {
      logout();
      history.push("../");
    }
  }

  function handleLogout() {
    logout();
  }

  return (
    <nav className="navbar navbar-expand-xl navbar-light bg-light">
      <div className="navbar-brand">
        <Link to="../dashboard" className="logo-link">
          <b>{process.env.REACT_APP_NAME}</b>
        </Link>
      </div>
      <button
        type="button"
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        id="navbarCollapse"
        className="collapse navbar-collapse justify-content-start"
      >
        <div className="navbar-nav ml-auto">
          <div className="nav-item dropdown">
            <Link
              to={href}
              data-toggle="dropdown"
              className="nav-link dropdown-toggle user-action"
            >
             {info.name} <b className="caret"></b>
            </Link>
            <div className="dropdown-menu keep-inside-clicks-open dropdown-menu-lg-right">
              <Link to="./history" className="dropdown-item">
                <i className="fas fa-history"></i> Histórico de transferência
              </Link>
              <Link to="./settings" className="dropdown-item">
                <i className="fa fa-cog"></i> Configurações
              </Link>
              <div className="dropdown-divider"></div>
              <Link to={href} className="dropdown-item" onClick={handleLogout}>
                <i className="fa fa-sign-out-alt"></i> Sair
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;