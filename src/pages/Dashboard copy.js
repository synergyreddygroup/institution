import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    town: "",
    district: "",
    board: "",
    status: "default",
  });
  const [loading, setLoading] = useState(true);
  const [nextSerialId, setNextSerialId] = useState(10000);
  const [isIdAscending, setIsIdAscending] = useState(true);

  const districts = ["District 1", "District 2", "District 3"];
  const boards = ["Board A", "Board B", "Board C"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "data")); // Use "data" collection
        const allData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());

        const lastId = allData.length > 0 ? Math.max(...allData.map((d) => d.serialId)) : 9999;
        setNextSerialId(lastId + 1);
        setData(allData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.town || !formData.district || !formData.board) {
      alert("All fields are required.");
      return;
    }

    if (formData.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    try {
      await addDoc(collection(db, "data"), { // Use "data" collection
        ...formData,
        serialId: nextSerialId,
        timestamp: serverTimestamp(),
      });
      alert("Data added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        town: "",
        district: "",
        board: "",
        status: "default",
      });
      fetchData();
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Failed to add data.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const docRef = doc(db, "data", id); // Use "data" collection
      await updateDoc(docRef, { status });
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "data", id); // Use "data" collection
      await deleteDoc(docRef);
      alert("Data deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete data.");
    }
  };

  const handleSortById = () => {
    const sortedData = [...data].sort((a, b) => {
      return isIdAscending ? a.serialId - b.serialId : b.serialId - a.serialId;
    });
    setData(sortedData);
    setIsIdAscending(!isIdAscending);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <div className="main-content">
        <h2>Institution Directory</h2>
        <div className="data-form">
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone (10 digits)" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input type="text" name="town" placeholder="Town" value={formData.town} onChange={handleChange} required />
            <select name="district" value={formData.district} onChange={handleChange} required>
              <option value="">Select District</option>
              {districts.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
            <select name="board" value={formData.board} onChange={handleChange} required>
              <option value="">Select Board</option>
              {boards.map((board) => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
            <button type="submit">Add Data</button>
          </form>
        </div>
        <br /> <br />
        <button onClick={handleSortById} className="sort-btn">
          Sort by ID ({isIdAscending ? "Ascending" : "Descending"})
        </button>
        <br /> <br />

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Serial ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Town</th>
                  <th>District</th>
                  <th>Board</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry) => (
                  <tr
                    key={entry.id}
                    style={{
                      backgroundColor:
                        entry.status === "completed"
                          ? "#00ff003d"
                          : entry.status === "pending"
                          ? "#fff7003d"
                          : entry.status === "success"
                          ? "#ff00773d"
                          : "#ffffffaf",
                      color: entry.status !== "default" ? "white" : "black",
                    }}
                  >
                    <td>{entry.serialId}</td>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.phone}</td>
                    <td>{entry.address}</td>
                    <td>{entry.town}</td>
                    <td>{entry.district}</td>
                    <td>{entry.board}</td>
                    <td>
                      <select className="status-dropdown" value={entry.status} onChange={(e) => handleStatusChange(entry.id, e.target.value)}>
                        <option value="default">Default</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                      </select>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;