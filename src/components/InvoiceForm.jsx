import React, { useRef, useState, useMemo } from "react";
import { Form, Row, Col, Card, Button, Modal } from "react-bootstrap";
import InvoiceItem from "./resuable/InvoiceItem";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoiceForm() {
  const [state, setState] = useState({
    currency: "₹",
    invoiceNumber: "",
    billTo: "",
    billToEmail: "",
    billToAddress: "",
    billFrom: "Anu Art Studio",
    billFromEmail: "anu@gmail.com",
    billFromAddress: "Chennai",
    notes: "",
    taxRate: "5",
    discountRate: "10",
  });

  const [items, setItems] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const invoiceRef = useRef();

  // Input change
  const onchange = (event) => {
    const { name, value } = event.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Edit item
  const onItemizedItemEdit = (event) => {
    const id = event.target.id;
    const name = event.target.name;
    let value = event.target.value;

    if (event.target.type === "number") {
      value = value === "" ? 0 : Number(value);
    }

    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [name]: value } : it))
    );
  };

  // Add new row
  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 99999999)).toString(36);
    const newItem = {
      id,
      name: "default",
      description: "",
      price: 0,
      quantity: 1,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Delete row
  const handleRowDel = (item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  // Calculations
  const subTotal = useMemo(
    () =>
      items.reduce((sum, it) => {
        const p = Number(it.price) || 0;
        const q = Number(it.quantity) || 0;
        return sum + p * q;
      }, 0),
    [items]
  );

  const discountAmount = useMemo(
    () => subTotal * ((Number(state.discountRate) || 0) / 100),
    [subTotal, state.discountRate]
  );

  const taxAmount = useMemo(
    () => (subTotal - discountAmount) * ((Number(state.taxRate) || 0) / 100),
    [subTotal, discountAmount, state.taxRate]
  );

  const total = useMemo(
    () => subTotal - discountAmount + taxAmount,
    [subTotal, discountAmount, taxAmount]
  );

  // PDF Download
  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${state.invoiceNumber || "draft"}.pdf`);
  };

  return (
    <>
      <Form>
        <Row>
          <Col md={8} lg={9}>
            <Card className="d-flex p-4 p-xl-5 my-3 shadow-sm rounded-3" ref={invoiceRef}>
              <div className="d-flex flex-row justify-content-between">
                <div className="mb-2">
                  <span className="fw-bold">Current Date:&nbsp;</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="mb-2">
                  <span className="fw-bold">Invoice Number:&nbsp;</span>
                  <Form.Control
                    type="text"
                    placeholder="Enter Invoice No."
                    value={state.invoiceNumber}
                    name="invoiceNumber"
                    onChange={onchange}
                    style={{ width: "150px", display: "inline-block" }}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Customer Details:</Form.Label>
                  <Form.Control
                    placeholder="Enter name"
                    value={state.billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    onChange={onchange}
                  />
                  <Form.Control
                    placeholder="Enter Email"
                    value={state.billToEmail}
                    type="email"
                    name="billToEmail"
                    className="my-2"
                    onChange={onchange}
                  />
                  <Form.Control
                    placeholder="Enter Address"
                    value={state.billToAddress}
                    type="text"
                    name="billToAddress"
                    className="my-2"
                    onChange={onchange}
                  />
                </Col>

                <Col>
                  <Form.Label className="fw-bold">Bill From:</Form.Label>
                  <Form.Control value={state.billFrom} className="my-2" disabled />
                  <Form.Control value={state.billFromEmail} className="my-2" disabled />
                  <Form.Control value={state.billFromAddress} className="my-2" disabled />
                </Col>
              </Row>

              <InvoiceItem
                items={items}
                onItemizedItemEdit={onItemizedItemEdit}
                onRowAdd={handleAddEvent}
                onRowDel={handleRowDel}
                currency={state.currency}
              />

              <hr />

              <div className="d-flex justify-content-end">
                <div style={{ width: 320 }}>
                  <div className="d-flex justify-content-between">
                    <div>Subtotal:</div>
                    <div>
                      {state.currency} {subTotal.toFixed(2)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>Discount: {state.discountRate || 0}%</div>
                    <div>
                      {state.currency} {discountAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>Tax: {state.taxRate || 0}%</div>
                    <div>
                      {state.currency} {taxAmount.toFixed(2)}
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <div>Total:</div>
                    <div>
                      {state.currency} {total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={4} lg={3}>
            <Card className="p-3 my-3 shadow-sm rounded-3">
              <Button
                className="mb-3 w-100"
                variant="primary"
                onClick={() => setShowReview(true)}
              >
                Review Invoice
              </Button>

              <Form.Group className="mb-3">
                <Form.Label>Currency:</Form.Label>
                <Form.Select
                  value={state.currency}
                  name="currency"
                  onChange={onchange}
                >
                  <option>₹</option>
                  <option>$</option>
                  <option>€</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tax Rate:</Form.Label>
                <Form.Control
                  type="number"
                  name="taxRate"
                  value={state.taxRate}
                  onChange={onchange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Discount Rate:</Form.Label>
                <Form.Control
                  type="number"
                  name="discountRate"
                  value={state.discountRate}
                  onChange={onchange}
                />
              </Form.Group>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Review Popup */}
      <Modal
        show={showReview}
        onHide={() => setShowReview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Invoice Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={invoiceRef}>
            <h5>Invoice #{state.invoiceNumber || "Draft"}</h5>
            <p><strong>Customer:</strong> {state.billTo}</p>
            <p><strong>Email:</strong> {state.billToEmail}</p>
            <p><strong>Address:</strong> {state.billToAddress}</p>

            <table className="table mt-3">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>{it.description}</td>
                    <td>{it.quantity}</td>
                    <td>
                      {state.currency} {it.price}
                    </td>
                    <td>
                      {state.currency} {(it.price * it.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />
            <div className="d-flex justify-content-end">
              <div style={{ width: "250px" }}>
                <div className="d-flex justify-content-between">
                  <div>Subtotal:</div>
                  <div>
                    {state.currency} {subTotal.toFixed(2)}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Discount:</div>
                  <div>
                    {state.currency} {discountAmount.toFixed(2)}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Tax:</div>
                  <div>
                    {state.currency} {taxAmount.toFixed(2)}
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <div>Total:</div>
                  <div>
                    {state.currency} {total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReview(false)}>
            Edit Again
          </Button>
          <Button variant="success" onClick={handleDownloadPdf}>
            Download Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
