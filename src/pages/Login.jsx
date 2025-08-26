import React, {useState} from "react";
import { login } from "../api/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login(){
  const [form, setForm] = useState({email:"", password:""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  function validate(){
    if(!form.email || !form.password) return "Все поля обязательны.";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Введите корректный email.";
    return "";
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    const v = validate();
    if(v){ setError(v); return; }
    setLoading(true);
    try{
      await login(form);
      navigate(from, {replace:true});
    }catch(err){
      setError(err?.message || "Ошибка сервера");
    }finally{ setLoading(false); }
  }

  return (
    <div>
      <h2>Вход</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="input" type="password" placeholder="Пароль" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading? "..." : "Войти"}</button>
        <div style={{marginTop:8}}>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></div>
      </form>
    </div>
  );
}
