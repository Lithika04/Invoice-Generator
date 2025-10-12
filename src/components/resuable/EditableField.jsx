import React from "react";
import { Form, InputGroup } from "react-bootstrap";

export default function EditableField(props) {
  const { cellData, onItemizedItemEdit } = props;

  return (
    <InputGroup className="my-1 flex-nowrap">
      {cellData.leading && (
        <InputGroup.Text className="bg-light fw-bold border-0 text-secondary px-2">
          <span
            className="border border-2 border-secondary rounded-circle d-flex align-items-center justify-content-center small"
            style={{ width: "20px", height: "20px" }}
          >
            {cellData.leading}
          </span>
        </InputGroup.Text>
      )}

      <Form.Control
        className={cellData.textAlign}
        type={cellData.type}
        placeholder={cellData.placeholder}
        min={cellData.min}
        max={cellData.max}
        name={cellData.name}
        id={cellData.id}
        value={cellData.value}
        step={cellData.step}
        onChange={onItemizedItemEdit}
        required={cellData.required || false}
      />
    </InputGroup>
  );
}
