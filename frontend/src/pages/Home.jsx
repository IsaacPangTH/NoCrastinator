import React from "react";
import { Navigate } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Navigate to="/login" />
    </div>
  );
}
