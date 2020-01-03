import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import EditMaterial from "./EditMaterial";
import MaterialCutList from "./MaterialCutList";
import ReactCardFlip from "react-card-flip";

export default function Material({ name, id, width, height, parts }) {
  const [editMode, setEditMode] = useState(false);

  const onEditMaterial = () => {
    setEditMode(true);
  };
  const onEditComplete = () => {
    setEditMode(false);
  };
  return (
    <ReactCardFlip infinite isFlipped={editMode}>
      <MaterialCutList
        key="front"
        id={id}
        width={width}
        height={height}
        name={name}
        parts={parts}
        onEditMaterial={onEditMaterial}
      />
      <EditMaterial
        key="back"
        name={name}
        width={width}
        height={height}
        id={id}
        onEditComplete={onEditComplete}
      />
    </ReactCardFlip>
  );
}

Material.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  parts: PropTypes.arrayOf(PropTypes.object.isRequired)
};
