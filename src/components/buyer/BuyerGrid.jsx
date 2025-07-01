import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const BuyerGrid = ({ setFormData }) => {
  const [buyers, setBuyers] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState("Details");

  const API_BASE_URL = "http://localhost:5000/api";

  // Map user-friendly column labels to actual keys in the buyer object
  const columnMap = {
    "Type": "type",
    "Buyer Name": "buyername",
    "Contact": "contact",
    "Price Range": "pricerange",
    "Details": "details",
    "Created Date": "createdAt",
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/buyers`, { method: "GET" });
      const data = await response.json();
      setBuyers(data.buyers);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  const handleDelete = async (_id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized!");

    if (confirm("Are you sure you want to delete this buyer?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/buyer/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ _id }),
        });

        const data = await response.json();
        if (data.message) {
          alert("Buyer deleted.");
          setBuyers(buyers.filter(b => b._id !== _id));
        } else {
          alert(data.error);
        }
      } catch (err) {
        alert("Error deleting buyer.");
      }
    }
  };
  const handleEdit = async (_id) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Unauthorized request!");

  if (confirm("Are you sure you want to edit this buyer?")) {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ _id }),
      });

      const data = await response.json();

      if (data.buyer) {
        setFormData({ ...data.buyer }); // populate form with buyer details
      } else {
        alert(data.error || "Failed to fetch buyer details.");
      }
    } catch (error) {
      alert("Error fetching buyer details.");
    }
  }
};

  const filteredBuyers = buyers
    .filter(buyer => filterType === "All" || buyer.type === filterType)
    .filter((buyer) => {
      const field = columnMap[searchColumn];
      const value = buyer[field];
      return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

  const sortedBuyers = [...filteredBuyers].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn] ?? "";
    const valB = b[sortColumn] ?? "";
    return sortOrder === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  const handleSort = (label) => {
    const column = columnMap[label];
    const newOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  return (
    <div className="buyer-grid-container">
      <div className="filter-tabs">
        <div className="filter-btns">
          {["All", "Buyer", "Rental"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={filterType === type ? "active" : ""}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="filter-dropdown">
          <select className="search-dropdown" onChange={(e) => setSearchColumn(e.target.value)}>
            {Object.keys(columnMap).map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search buyer..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field"
          />
        </div>
      </div>

      <table className="buyer-grid">
        <thead>
          <tr>
            {Object.keys(columnMap).map((label) => (
              <th key={label} onClick={() => handleSort(label)}>
                {label}
                <span className="order-span">
                  {sortColumn === columnMap[label]
                    ? sortOrder === "asc"
                      ? " ▲"
                      : " ▼"
                    : " ▼"}
                </span>
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedBuyers.length > 0 ? (
            sortedBuyers.map((buyer) => (
              <tr key={buyer._id}>
                <td>{buyer.type}</td>
                <td>{buyer.buyername}</td>
                <td>{buyer.contact}</td>
                <td>{buyer.pricerange || "N/A"}</td>
                <td>{buyer.details}</td>
                <td>{buyer.createdAt}</td>
                <td>
                  <button
                    title="Edit Buyer"
                    className="edit-btn"
                    onClick={() => handleEdit(buyer._id)}
                  >
                    <FaEdit className="icon" />
                  </button>
                  <button
                    title="Delete Buyer"
                    className="delete-btn"
                    onClick={() => handleDelete(buyer._id)}
                  >
                    <FaTrash className="icon" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BuyerGrid;
