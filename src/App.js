import { useState } from "react";
import AutoComplete from "./AutoComplete";
import "./styles.css";

const users = [
  { id: 1, name: "Rahul soni", age: 25 },
  { id: 2, name: "raman patel", age: 25 },
  { id: 3, name: "Soham singh", age: 25 },
  { id: 4, name: "nimesh parmar", age: 25 },
];

const fetchUsers = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(result);
    }, 700);
  });
};
export default function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="App">
      <h1>AutoComplete Search</h1>
      <AutoComplete fetchOptions={fetchUsers} onSelect={setSelectedUser} />

      {selectedUser && <div> Selected User: {selectedUser.name} </div>}
    </div>
  );
}
