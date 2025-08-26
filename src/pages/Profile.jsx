import React, {useState, useEffect} from "react";
import { getCurrentUser, updateProfile } from "../api/auth";

export default function Profile(){
  const user = getCurrentUser();
  const [form, setForm] = useState({username:user?.username||"", email:user?.email||"", password:""});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ setForm({username:user?.username||"", email:user?.email||"", password:""}); },[user]);

  function validate(){
    if(!form.username || !form.email) return "Имя и email обязательны.";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Введите корректный email.";
    if(form.password && form.password.length < 6) return "Пароль должен быть минимум 6 символов.";
    return "";
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError(""); setMessage("");
    const v = validate();
    if(v){ setError(v); return; }
    setLoading(true);
    try{
      const res = await updateProfile({id:user.id, username: form.username, email: form.email, password: form.password || undefined});
      setMessage("Профиль обновлён.");
      // clear password field
      setForm(f=>({...f, password:""}));
    }catch(err){
      setError(err?.message || "Ошибка сервера");
    }finally{ setLoading(false); }
  }

  return (
    <div>
      <h2>Редактирование профиля</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input className="input" placeholder="Имя пользователя" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="input" type="password" placeholder="Новый пароль (оставьте пустым чтобы не менять)" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {error && <div className="error">{error}</div>}
        {message && <div style={{color:"green"}}>{message}</div>}
        <button className="btn" disabled={loading}>{loading? "..." : "Сохранить"}</button>
      </form>
    </div>
  );
}
