import React from "react";
import "./listGroup.css";
import Select from "./select";

const ListGroup = (props) => {
  const {
    items,
    /*  textProperty, valueProperty, selectedItem, */ onItemSelect,
  } = props;
  return (
    <Select
      options={items}
      onChange={(e) => {
        onItemSelect(items[e.target.value]);
      }}
    ></Select>
  );

  // <ul className="list-Fonction">
  //   {items.map((item) => (
  //     <li
  //       onClick={() => onItemSelect(item)}
  //       key={item[valueProperty]}
  //       className={
  //         item === selectedItem ? "list-group-item active" : "list-group-item"
  //       }
  //     >
  //       {item[textProperty]}
  //     </li>
  //   ))}
  // </ul>
};
ListGroup.defaultProps = {
  textProperty: "nom",
  valueProperty: "_id",
};

export default ListGroup;
