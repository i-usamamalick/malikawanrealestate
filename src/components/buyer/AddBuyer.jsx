const API_BASE_URL = "http://localhost:5000/api";
const AddBuyer = ({ formData, setFormData }) => {
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isEditMode = formData._id !== null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value === "")) {
      alert("Please fill in all the fields.");
      return;
    }
    const { createdBy, __v, ...cleanedFormData } = formData;
    // ✅ Format createdAt only if it's present and in edit mode
    if (isEditMode && cleanedFormData.createdAt) {
      const date = new Date(cleanedFormData.createdAt);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      cleanedFormData.createdAt = `${day}/${month}/${year}`;
    }
    try {
      const endpoint = isEditMode ? "/buyer/edit" : "/buyer/save";
      const method = isEditMode ? "PATCH" : "POST";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedFormData),
      });

      const data = await response.json();
      if (data.message) {
        alert(isEditMode ? "Buyer updated successfully!" : "Buyer details saved!");
        window.location.reload()
        setFormData({
          buyername: "",
          contact: "",
          details: "",
          type: "Buyer",
          pricerange: "",
          _id: null,
        });
      } else {
        alert(data.error || "Failed to process buyer.");
      }
    } catch (error) {
      alert("Error saving buyer.");
    }
  };
  return (
    <div className="addbuyerdashboard">
      <h2>Buyer Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div className="property-card">
          <div className="fieldRow">
            <div className="fieldCol">
              <label>Buyer Name:</label>
              <input
                type="text"
                name="buyername"
                maxLength="150"
                placeholder="Enter buyer name"
                value={formData.buyername}
                onChange={handleChange}
              />
            </div>
            <div className="fieldCol">
              <label>Contact No.:</label>
              <input
                type="text"
                name="contact"
                placeholder="Enter contact no."
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="fieldRow">
            <div className="fieldCol">
              <label>Type:</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Buyer">Buyer</option>
                <option value="Rental">Rental</option>
              </select>
            </div>
            <div className="fieldCol">
              <label>Price:</label>
              <input
                type="number"
                name="pricerange"
                min={0}
                placeholder="Enter Price Range"
                value={formData.pricerange}
                onChange={handleChange}
              />
            </div>
          </div>
          <label>Details:</label>
          <textarea
            name="details"
            maxLength="1200"
            placeholder="Describe your needs and requirements..."
            value={formData.details}
            onChange={handleChange}
          ></textarea>
          <div className="button-container">
            <button type="submit" className="save-buyer-btn">
              {isEditMode ? "Update Buyer" : "Save Buyer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBuyer;
