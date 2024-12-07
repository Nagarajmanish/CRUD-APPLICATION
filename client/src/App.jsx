import './App.css'
import axios from "axios";
import { useState, useEffect } from 'react'

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterusers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userdata, setUserdata] = useState({ name: "", age: "", city: "" });

  // Search functionality
  const handleChangeSearch = (e) => {
    const searchdata = e.target.value.toLowerCase();
    const filterdata = users.filter((user) =>
      user.name.toLowerCase().includes(searchdata) || user.city.toLowerCase().includes(searchdata)
    );
    setFilterusers(filterdata);
  }

  // Delete Details
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to Delete this User?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterusers(res.data);
      })
    }
  }

  // Add Record
  const handleAddRecord = () => {
    setUserdata({ name: "", age: "", city: "" }); // Reset form data
    setIsModelOpen(true);
  }

  // Close Functionality
  const handleclose = () => {
    setIsModelOpen(false);
    getAllUsers();
  }

  // All users Display
  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then((res) => {
      setUsers(res.data);
      setFilterusers(res.data);
    });
  }

  // New User functionality
  const handleData = (e) => {
    setUserdata({ ...userdata, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(userdata.id){
      await axios.patch(`http://localhost:8000/users/${userdata.id}`, userdata).then((res) => {
        console.log(res);
         getAllUsers(); // Refresh the list
         setIsModelOpen(false); // Close modal after submission
         setUserdata({ name: "", age: "", city: "" }); // Reset form data after submission
      });
    }
    else{
    await axios.post("http://localhost:8000/users", userdata).then((res) => {
      console.log(res);
       getAllUsers(); // Refresh the list
       setIsModelOpen(false); // Close modal after submission
       setUserdata({ name: "", age: "", city: "" }); // Reset form data after submission
    });
  }
  handleclose();
  setUserdata({ name: "", age: "", city: "" });
}

  const handleUpdate = (user)=>{
      setUserdata(user);
      setIsModelOpen(true);
  }

  useEffect(() => {
    getAllUsers();
  }, [])

  return (
    <>
      <div className='details-container'>
        <h3>CRUD Application using React js frontend and Node js Backend</h3>
        <div className="input-box">
          <input type="search" placeholder='search text here' onChange={handleChangeSearch} />
          <button className='btn green' onClick={handleAddRecord}>Add Record</button>
        </div>
        <div className="record-details">
          <table className='table'>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filterusers && filterusers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td><button className='btn green' onClick={()=> handleUpdate(user)}>Edit</button></td>
                    <td><button className='btn red' onClick={() => handleDelete(user.id)}>Delete</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {isModelOpen && (
          <div className="model">
            <div className="model-container">
              <span className="close" onClick={handleclose}>&times;</span>
              <h2>{userdata.id?"Update Record":"Add Record"}</h2>
              <div className="details">
                <div className="input-grp">
                  <label htmlFor="name">Enter Name:</label>
                  <input
                    type="text"
                    className="text"
                    id="name"
                    name="name"
                    value={userdata.name}
                    onChange={handleData}
                  />
                </div>
                <div className="input-grp">
                  <label htmlFor="age">Enter Age:</label>
                  <input
                    type="text"
                    className="text"
                    id="age"
                    name="age"
                    value={userdata.age}
                    onChange={handleData}
                  />
                </div>
                <div className="input-grp">
                  <label htmlFor="city">Enter City:</label>
                  <input
                    type="text"
                    className="text"
                    id="city"
                    name="city"
                    value={userdata.city}
                    onChange={handleData}
                  />
                </div>
                <button className='btn green' onClick={handleSubmit}>{userdata.id?"Update Record":"Add Record"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App;
