

import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    batch: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/students/register",
        formData
      );
      setMessage(response.data.message);
      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({
          name: "",
          address: "",
          email: "",
          batch: "",
          password: "",
        });
        setMessage("");
        setIsSubmitted(false);
      }, 5000); 
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Error: " + error.response.data.error);
      } else {
        setMessage("Email has already been used.");
      }

      setFormData({
        name: "",
        address: "",
        email: "",
        batch: "",
        password: "",
      });

      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div className="container">
      <h1>Gym Registration</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          required
        >
          <option value="">Select Batch</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;

