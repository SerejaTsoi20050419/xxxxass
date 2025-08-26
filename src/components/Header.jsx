import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../api/auth";

export default function Header(){
  const user = getCurrentUser();
  const navigate = useNavigate();

  async function handleLogout(){
    try{
      await logout();
      navigate("/login");
    }catch(e){
      console.error(e);
    }
  }

  return (
    <header>
      <div className="header-left">
        <Link to="/">SimpleBlog</Link>
        <nav>
          <Link to="/" style={{marginLeft:12}}>Home</Link>
        </nav>
      </div>

      <div className="header-right">
        {user ? (
          <>
            <div className="user-badge" onClick={()=>navigate("/profile")}>
              <div className="avatar">{user.username?.[0]?.toUpperCase()||"U"}</div>
              <div>{user.username}</div>
            </div>
            <button className="btn" onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn">Войти</button></Link>
            <Link to="/register"><button className="btn">Зарегистрироваться</button></Link>
          </>
        )}
      </div>
    </header>
  );
}
