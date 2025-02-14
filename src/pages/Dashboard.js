import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; // Import Navbar Component
import "../styles/Dashboard.css"; // Import CSS file for Dashboard
import { db } from "../firebase/firebaseConfig"; // Firebase database
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore"; // Firebase methods

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [town, setTown] = useState("");
  const [district, setDistrict] = useState("");
  const [board, setBoard] = useState("");
  const districts = [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanumakonda",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem Asifabad",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal–Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
  ];
  const boards = ["STATE", "CBSE", "ICSE", "OTHER"];
  const [loading, setLoading] = useState(true);
  const [nextSerialId, setNextSerialId] = useState(10000);
  const [isIdAscending, setIsIdAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "data"));
      const allData = querySnapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());

      const lastId = allData.length > 0 ? Math.max(...allData.map((d) => d.serialId)) : 9999;
      setNextSerialId(lastId + 1);
      setData(allData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || phone.length !== 10) {
      alert("All fields are required and phone must be 10 digits.");
      return;
    }

    try {
      await addDoc(collection(db, "data"), {
        name,
        email,
        phone,
        address,
        town,
        district,
        board,
        serialId: nextSerialId,
        status: "default",
        timestamp: serverTimestamp(),
      });
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setTown("");
      setDistrict("");
      setBoard("");
      fetchData();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add data.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "data", id));
      fetchData();
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete data.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "data", id), { status: newStatus });
      fetchData();
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const handleSortById = () => {
    const sortedData = [...data].sort((a, b) => (isIdAscending ? a.serialId - b.serialId : b.serialId - a.serialId));
    setData(sortedData);
    setIsIdAscending(!isIdAscending);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="main-content">
        <h2>Institution Directory</h2>
        <div className="data-form">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="tel" placeholder="Phone (10 digits)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input type="text" placeholder="Town" value={town} onChange={(e) => setTown(e.target.value)} />
            <select value={district} onChange={(e) => setDistrict(e.target.value)} required>
              <option value="">Select District</option>
              {districts.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
            <select value={board} onChange={(e) => setBoard(e.target.value)} required>
              <option value="">Select Board</option>
              {boards.map((board) => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
            <button type="submit">Add Data</button>
          </form>
        </div>
        <button onClick={handleSortById} className="sort-btn">Sort by ID ({isIdAscending ? "Ascending" : "Descending"})</button> <br/><br/>
        <div class="search-container">
          <input type="text" placeholder="Search..." className="search-input" onChange={handleSearch} />
          
        </div>
        <br/> <br/>
        {loading ? <div>Loading...</div> : (
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

                {data
                  .filter((entry) => {
                    const fullName = `${entry.name} ${entry.email} ${entry.phone} ${entry.address} ${entry.town} ${entry.district} ${entry.board}`.toLowerCase(); // Combine all the fields you want to be able to search by
                    return fullName.includes(searchTerm.toLowerCase());
                  })
                  .map((entry) => (
                  <tr
                    key={entry.id} // Key prop is now correctly assigned
                    style={{
                      backgroundColor:
                        entry.status === "active"
                          ? "#00ff003d"
                          : entry.status === "notintouch"
                          ? "#fff7003d"
                          : entry.status === "inactive"
                          ? "#ff00003d"
                          : "#ffffffaf",
                      color: entry.status !== "nocontact" ? "white" : "black",
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
                      <select value={entry.status} onChange={(e) => handleStatusChange(entry.id, e.target.value)}>
                        <option value="nocontact">No Contact</option>
                        <option value="active">Active</option>
                        <option value="notintouch">Not in Touch</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(entry.id)}>Delete</button>
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
