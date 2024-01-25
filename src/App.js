import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const refreshToken = queryParameters.get("refreshToken");
  useEffect(() => {
    if (refreshToken) {
      setLoggedIn(true);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("loggedIn", loggedIn);
    } else {
      localStorage.setItem("loggedIn", false);
    }
  }, []);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") ?? false
  );

  const initialFormData = {
    name: "",
    email: "",
    title: "",
    startDatetime: "",
    endDatetime: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, title, startDatetime, endDatetime } = formData;
    axios
      .post("http://localhost:8000/create-event", {
        name,
        email,
        title,
        startDatetime,
        endDatetime,
        refreshToken,
      })
      .then((response) => {
        setFormData(initialFormData);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleClick = () => {
    axios
      .get("http://localhost:8000/generate-authorization-url")
      .then((response) => {
        console.log(response.data);
        const { url } = response.data;
        window.location.href = url;
        setLoggedIn(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="App">
      {loggedIn === true ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title: </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Start Datetime: </label>
            <input
              type="datetime-local"
              name="startDatetime"
              value={formData.startDatetime}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label>End Datetime: </label>
            <input
              type="datetime-local"
              name="endDatetime"
              value={formData.endDatetime}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email ID: </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Name of Person: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <button onClick={handleClick}>Google Authenticate</button>
      )}
    </div>
  );
}

export default App;
