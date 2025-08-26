import React, {useState} from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [form, setForm] = useState({username:"", email:"", password:""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate(){
    if(!form.username || !form.email || !form.password) return "Все поля обязательны.";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Введите корректный email.";
    if(form.password.length < 6) return "Пароль должен быть минимум 6 символов.";
    return "";
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError("");
    const v = validate();
    if(v){ setError(v); return; }
    setLoading(true);
    try{
      await register(form);
      navigate("/");
    }catch(err){
      setError(err?.message || "Ошибка сервера");
    }finally{ setLoading(false); }
  }

  return (
    <div>
      <h2>Регистрация</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input className="input" placeholder="Имя пользователя" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="input" type="password" placeholder="Пароль" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading? "..." : "Зарегистрироваться"}</button>
      </form>
    </div>
  );
}
