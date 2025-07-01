import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import PropertyGrid from "../common/PropertyGrid";
import { FaTimes } from "react-icons/fa";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "malikawanrealestatebackend.railway.internal/api"

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: "Sale",
    dimensions: "",
    area: "",
    price: "",
    status: "Available",
    owner: "",
    contact: "",
    details: "",
    location: "",
    images: [],
    date: new Date().toISOString().split("T")[0], // Auto-set current date
    _id: null
  });

  const handleEdit = async (_id) => {
    const token = localStorage.getItem("token"); // Retrieve authentication token
    if (!token) return alert("Unauthorized request!");

    if(confirm("Are you sure you want to edit?") == true) {
      try {
        const response = await fetch(`${API_BASE_URL}/property/edit`, {
          method: "PATCH", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ _id }), // Send property ID as payload
        });

        const data = await response.json();

        if (data.property) {
          const formattedDate = new Date(data.property.date).toLocaleDateString("en-GB");
          setFormData({ ...data.property, date: formattedDate });
        } else {
          alert(data.error || "Failed to fetch property details.");
        }
      } catch (error) {
        alert("Error fetching property details. Please try again.", error);
      }
    }
    else {
      return
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dimensions") {
      // Remove non-numeric characters except 'x'
      const cleanedValue = value.replace(/[^0-9x]/g, "");
  
      // Ensure format stays as 'XXXxXXX' (auto-inserting 'x')
      const parts = cleanedValue.split("x");
      let beforeX = parts[0]?.slice(0, 3) || "";
      let afterX = parts[1]?.slice(0, 3) || "";
  
      setFormData({ ...formData, dimensions: `${beforeX}x${afterX}` });
    }
    else if (name === "contact") {
      let cleanedContact = value.replace(/\D/g, ""); // Remove non-numeric characters

      if (cleanedContact.length > 11) return;
  
      setFormData({ ...formData, contact: cleanedContact });
    }
    else{
      setFormData({ ...formData, [name]: value });
    }
  };
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set new width & height (adjustable)
        canvas.width = img.width * 0.8; // Reduce size
        canvas.height = img.height * 0.8;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type, 0.8); // Adjust quality (0.8 = 80% compression)
      };
    });
  };
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Prevent selection if total images exceed 10
    if (files.length + formData.images.length > 10) {
      alert("You can upload a maximum of 10 images.");
      e.target.value = ""; // Reset file input to prevent upload
      return;
    }

    // Filter out files exceeding 1MB before compression
    const validFiles = files.filter(file => file.size <= 1048576);
    if (validFiles.length < files.length) {
      alert("Some images exceed the 1MB limit and were not uploaded.");
    }

    // **Compress images before converting to Base64**
    const compressedFiles = await Promise.all(validFiles.map(compressImage));

    const convertToBase64 = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
    };

    const base64Images = await Promise.all(compressedFiles.map(convertToBase64));

    const imageData = base64Images.map((src, index) => ({
      name: compressedFiles[index].name,
      src, // Base64 encoded string
    }));

    setFormData((prevData) => ({
      ...prevData,
      images: imageData, // Store compressed and Base64 encoded images
    }));
  };

  const removeImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  
  
  const token = localStorage.getItem("token");
  const handleSubmit = async () => {
    // (Object.values(formData).some((value) => value === "" || value.length === 0))
    if (!formData || Object.values(formData).some(value => value === "" || (typeof value === "string" && value.trim().length === 0))) {
      alert("All fields are required!");
      return;
    }
    const { createdBy, __v, ...cleanedFormData } = formData;
    console.log(cleanedFormData)
    const apiURL = formData._id == null ? `${API_BASE_URL}/property/save` : `${API_BASE_URL}/property/edit`
    try {
      const response = await fetch(`${apiURL}`, {
        method: `${formData._id == null ? 'POST' : 'PATCH'}`,
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` },
        body: JSON.stringify(cleanedFormData),
      });

      const data = await response.json();
      if(data.message) {
        alert(data.message)
        window.location.reload();
        setFormData({
          type: "Sale",
          dimensions: "",
          area: "",
          price: "",
          status: "Available",
          owner: "",
          contact: "",
          details: "",
          location: "",
          images: [],
          date: new Date().toISOString().split("T")[0], // Reset to current date
          _id: null
        });
      }
      else {
        alert(data.error)
      }
    } catch (error) {
      alert("Error saving property. Please try again.", error);
    }
  };
  const handleCancel = () => {
    setFormData({
      type: "Sale",
      dimensions: "",
      area: "",
      price: "",
      status: "Available",
      owner: "",
      contact: "",
      details: "",
      location: "",
      images: [],
      date: new Date().toISOString().split("T")[0], // Reset to current date
      _id: null, // Clear ID to return to Add Property mode
    });
  };


  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate("/buyers")} className="view-buyers-btn">
        Add / View Buyers
      </button>
      <div className="property-card">
        <div className="fieldRow">
          <div className="fieldCol">
            <label>Owner Name:</label>
            <input type="text" name="owner" maxLength="150" placeholder="Enter owner name" value={formData.owner} onChange={handleChange} />
          </div>
          <div className="fieldCol">
            <label>Contact No.:</label>
            <input type="text" name="contact" placeholder="Enter contact no." value={formData.contact} onChange={handleChange} />
          </div>
        </div>

        <div className="fieldRow">
          <div className="fieldCol">
            <label>Type:</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
          </div>
          <div className="fieldCol">
            <label>Dimensions:</label>
            <input type="text" name="dimensions" maxLength="7" placeholder="e.g., 25x45" value={formData.dimensions} onChange={handleChange}/>
          </div>
        </div>
        <div className="fieldRow">
          <div className="fieldCol">
            <label>Size:</label>
            <input type="text" name="area" placeholder="e.g., 5 Marla" value={formData.area} onChange={handleChange} />
          </div>
          <div className="fieldCol">
            <label>Price:</label>
            <input type="number" name="price" min={0} placeholder="Enter Price" value={formData.price} onChange={handleChange} />
          </div>
        </div>
        <div className="fieldRow">
          <div className="fieldCol">
            <label>Status:</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="Rented Out">Rented Out</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>
          <div className="fieldCol">
            <label>Date:</label>
            <input type="text" name="date" readOnly value={formData.date} />
          </div>
        </div>
        <label>Details:</label>
        <textarea name="details" maxLength="1200" placeholder="Describe the property..." value={formData.details} onChange={handleChange}></textarea>

        <label>Location:</label>
        <input type="text" name="location" maxLength="150" placeholder="Enter address" value={formData.location} onChange={handleChange} />

        <label>Images:</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

        <div className="image-preview-container">
          {formData.images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image.src} alt={image.name} className="uploaded-image" />
              <button className="remove-image-btn" onClick={() => removeImage(index)}><FaTimes className="icon"/></button>
            </div>
          ))}
        </div>
        <div className="button-container">
          {formData._id !== null && (
            <button onClick={handleCancel} className="cancel-property-btn">Cancel</button>
          )}
          <button onClick={handleSubmit} className="add-property-btn">
            {formData._id == null ? "Add Property" : "Update Property"}
          </button>
        </div>
      </div>

      <PropertyGrid showActions={true} onEdit={handleEdit} />
    </div>
  );
};

export default Dashboard;
