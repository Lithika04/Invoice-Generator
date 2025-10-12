import React from "react";
import { Button, Table } from "react-bootstrap";
import EditableField from "./EditableField";
import { BiTrash } from "react-icons/bi";

export default function InvoiceItem(props) {
  const itemTable = props.items.map((item) => (
    <ItemRow
      key={item.id}
      item={item}
      currency={props.currency}
      onItemizedItemEdit={props.onItemizedItemEdit}
      onRowDel={props.onRowDel}
    />
  ));

  return (
    <div className="mt-4">
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th style={{ width: "60%" }}>Item</th>
            <th style={{ minWidth: "90px" }}>Quantity</th>
            <th style={{ minWidth: "130px" }}>Price/Rate</th>
            <th className="text-center" style={{ minWidth: "80px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>{itemTable}</tbody>
      </Table>

      <Button className="fw-bold mt-2" variant="primary" onClick={props.onRowAdd}>
        Add Item
      </Button>
    </div>
  );
}

function ItemRow(props) {
  const onDelEvent = () => props.onRowDel(props.item);

  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={props.onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "name",
            placeholder: "Item Name",
            value: props.item.name,
            id: props.item.id,
          }}
        />
        <EditableField
          onItemizedItemEdit={props.onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "description",
            placeholder: "Item Description",
            value: props.item.description,
            id: props.item.id,
          }}
        />
      </td>

      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={props.onItemizedItemEdit}
          cellData={{
            leading: props.currency,
            type: "number",
            name: "quantity",
            min: 0,
            step: "1",
            textAlign: "text-end",
            value: props.item.quantity,
            id: props.item.id,
          }}
        />
      </td>

      <td style={{ minWidth: "130px" }}>
        <EditableField
          onItemizedItemEdit={props.onItemizedItemEdit}
          cellData={{
            leading: props.currency,
            type: "number",
            name: "price",
            min: 0,
            step: "0",
            textAlign: "text-end",
            value: props.item.price,
            id: props.item.id,
          }}
        />
      </td>

      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={onDelEvent}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger rounded"
        />
      </td>
    </tr>
  );
}
