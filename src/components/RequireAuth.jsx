import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";

export default function RequireAuth({children}){
  const user = getCurrentUser();
  if(!user) return <Navigate to="/login" replace />;
  return children;
}
