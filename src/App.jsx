import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InvoiceForm from "./components/InvoiceForm";

function App() {
  return (
    <div className="container py-4">
      <h3 className="mb-4">Invoice Generator</h3>
      <InvoiceForm />
    </div>
  );
}

export default App;
