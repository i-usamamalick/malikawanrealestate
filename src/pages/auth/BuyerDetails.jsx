import { useState } from "react";
import AddBuyer from '../../components/buyer/AddBuyer'
import BuyerGrid from "../../components/buyer/BuyerGrid";
export const BuyerDetails = () => {
    const [formData, setFormData] = useState({
        buyername: "",
        contact: "",
        details: "",
        type: "Buyer",
        pricerange: "",
        _id: null,
    });
  return (
    <div className='card buyerdetailscomp'>
      <AddBuyer formData={formData} setFormData={setFormData} />
      <BuyerGrid setFormData={setFormData} />
    </div>
  );
}
