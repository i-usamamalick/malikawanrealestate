import { useState, useEffect } from "react";
import "../../App.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const PropertyGrid = ({ showActions, onEdit }) => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState("details"); // Default search column
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [properties, setProperties] = useState([]);
  const API_BASE_URL = "http://localhost:5000/api";
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`, { method: "GET" });
      const data = await response.json();
      setProperties(data.properties);
    } catch (error) {
      console.error("Error fetching properties.",error)
    }
  };

  const openModal = (images, index) => {
    setSelectedImages(images);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedImages.length) % selectedImages.length);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") nextImage();
    if (event.key === "ArrowLeft") prevImage();
    if (event.key === "Escape") closeModal();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); // Retrieve authentication token
    if (!token) return alert("Unauthorized request!");

    if (confirm("Are you sure you want to delete?") == true ) {
      try {
        const response = await fetch(`${API_BASE_URL}/property/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ id }), // Send property ID
        });

        const data = await response.json();

        if (data.message) {
          alert("Property deleted successfully!");
          setProperties(properties.filter(property => property._id !== id)); // Remove property from state
        } else {
          alert(data.error || "Failed to delete property.");
        }
      } catch (error) {
        alert("Error deleting property. Please try again.", error);
      }
    }
    else {
      return;
    }
  };

  // Filter properties
  const filteredProperties = properties
    .filter((property) => filter === "All" || property.type === filter)
    .filter((property) => property[searchColumn].toString().toLowerCase().includes(searchQuery.toLowerCase()));

  // Sort properties
  const handleSort = (column) => {
    const newOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (!sortColumn) return 0;
    if (sortOrder === "asc") return a[sortColumn] > b[sortColumn] ? 1 : -1;
    return a[sortColumn] < b[sortColumn] ? 1 : -1;
  });

  return (
    <div className="property-container">
      {/* Filter Tabs */}
      <div className="filter-tabs">
        <div className="filter-btns">
          {["All", "Sale", "Rent"].map((type) => (
            <button key={type} onClick={() => setFilter(type)} className={filter === type ? "active" : ""}>
              {type}
            </button>
          ))}
        </div>

        <div className="filter-dropdown">
          {/* Column Filter Dropdown */}
          <select className="search-dropdown" onChange={(e) => setSearchColumn(e.target.value)}>
            {["details", "type", "dimensions", "area", "price", "status", "location", ...(showActions ? ["owner", "contact"] : []), "date"].map((col) => (
              <option key={col} value={col}>
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </option>
            ))}
          </select>

          <input type="text" placeholder="Search Property..." onChange={(e) => setSearchQuery(e.target.value)} className="search-field" />
        </div>
      </div>

      {/* Property Table */}
      <div className="property-grid">
        <table>
          <thead>
            <tr>
              {["Type", "Dimensions", "Area", "Price (Rs.)", "Status", "Details", "Area / Location","Images", "Date", "Owner Name", "Contact No.", ].map((col) => (
                (col === "Owner Name" || col === "Contact No.") && !showActions ? null : // Hide for non-logged-in users
                <th key={col} onClick={() => handleSort(col.toLowerCase())}>
                  {col}<span className="order-span"> {sortColumn === col.toLowerCase() ? (sortOrder === "asc" ? "▲" : "▼") : "▼"}</span>
                </th>
              ))}
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {
              sortedProperties && sortedProperties.map((property) => (
                <tr key={property.id}>
                  <td>{property.type}</td>
                  <td>{property.dimensions}</td>
                  <td>{property.area}</td>
                  <td>
                    {`${property.price}${property.type === "Rent" ? " / month" : ""}`}
                  </td>
                  <td className={`status ${property.status.replace(" ", "-").toLowerCase()}`}>{property.status}</td>
                  <td>{property.details}</td>
                  <td>{property.location}</td>
                  <td>
                    <div className="property-image-column">
                      <img src={property.images.length > 1 ? "/src/images/deafult-multi-property-icon.png" : "/src/images/deafult-single-property-icon.png"} alt="Property Preview" title={property.images.length > 1 ?"Click to view more images":"Click to preview image"} className="property-image" onClick={() => openModal(property.images, 0)} />
                    </div>
                  </td>
                  <td>{new Date(property.date).toLocaleDateString("en-GB")}</td>
                  {showActions && <td>{property.owner}</td>}
                  {showActions && <td>{property.contact}</td>}
                  {showActions && (
                    <td>
                      <button className="edit-btn" title="Click to edit property details" onClick={() => onEdit(property._id)}><FaEdit className="icon" /></button>
                      <button className="delete-btn" title="Click to delete property" onClick={() => handleDelete(property._id)}><FaTrash className="icon" /></button>
                    </td>
                  )}
                </tr>
              ))
            }
            {
              !sortedProperties || sortedProperties.length==0 && 
              <tr><td colSpan={showActions?12:9}>No data found.</td></tr>
            }
            
          </tbody>
        </table>
      </div>
      {/* Custom Modal */}
      {modalOpen && (
        <div className="image-modal" onKeyDown={handleKeyDown} tabIndex={0}>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <button className="close-btn" title="Close" onClick={closeModal}>×</button>
            <button className="prev-btn" title="Previous Image" onClick={prevImage}>❮</button>
            <img src={selectedImages[currentImageIndex].src} alt="Property Image" />
            <button className="next-btn" title="Next Image" onClick={nextImage}>❯</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
