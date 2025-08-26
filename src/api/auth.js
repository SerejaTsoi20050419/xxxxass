// Fake "server" implemented with localStorage and Promises.
// This simulates registration, login, profile update and returns errors similar to a real API.

const USERS_KEY = "sba_users";
const AUTH_KEY = "sba_auth";

function readUsers(){
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch(e){ return []; }
}

function writeUsers(users){
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveAuth(user){
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearAuth(){
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(){
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch(e){ return null; }
}

// Simulate network delay and possible server-side validation
const delay = (ms=400) => new Promise(res=>setTimeout(res, ms));

export async function register({username, email, password}){
  await delay();
  const users = readUsers();
  if(!username || !email || !password){
    return Promise.reject({message: "Все поля обязательны."});
  }
  if(users.find(u => u.email === email)){
    return Promise.reject({message: "Пользователь с таким email уже существует."});
  }
  const id = Date.now().toString();
  const newUser = {id, username, email, password};
  users.push(newUser);
  writeUsers(users);
  saveAuth({id, username, email});
  return Promise.resolve({id, username, email});
}

export async function login({email, password}){
  await delay();
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if(!user){
    return Promise.reject({message: "Неверный email или пароль."});
  }
  saveAuth({id: user.id, username: user.username, email: user.email});
  return Promise.resolve({id: user.id, username: user.username, email: user.email});
}

export async function logout(){
  await delay(150);
  clearAuth();
  return Promise.resolve();
}

export async function updateProfile({id, username, email, password}){
  await delay();
  const users = readUsers();
  const idx = users.findIndex(u=>u.id===id);
  if(idx === -1) return Promise.reject({message: "Пользователь не найден."});
  // if changing email, ensure uniqueness
  if(email && users.some((u,i)=>u.email===email && i!==idx)){
    return Promise.reject({message: "Email уже используется другим пользователем."});
  }
  const user = users[idx];
  user.username = username || user.username;
  user.email = email || user.email;
  if(password) user.password = password;
  users[idx] = user;
  writeUsers(users);
  saveAuth({id:user.id, username:user.username, email:user.email});
  return Promise.resolve({id:user.id, username:user.username, email:user.email});
}
