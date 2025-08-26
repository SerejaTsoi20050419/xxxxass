import React from "react";
import { getCurrentUser } from "../api/auth";

export default function Home(){
  const user = getCurrentUser();
  return (
    <div>
      <h2>Главная</h2>
      <p>Это простая платформа блога с поддержкой регистрации и входа.</p>
      {user ? <p>Привет, <strong>{user.username}</strong> — вы вошли в систему.</p> : <p>Пожалуйста, войдите или зарегистрируйтесь, чтобы редактировать профиль.</p>}
    </div>
  );
}
