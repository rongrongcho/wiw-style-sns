import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../assets/styles/Content.css";
import Card from "./Card";
function Content() {
  return (
    <div className="content-box">
      <Card />
    </div>
  );
}

export default Content;
