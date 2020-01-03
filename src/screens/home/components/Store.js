import React, { useReducer } from "react";

// mutations
const MATERIAL_CHANGE = "MATERIAL_CHANGE";
const ADD_PART = "ADD_PART";
const UPDATE_PARTS = "UPDATE_PARTS";
const DELETE_MATERIAL = "DELETE_MATERIAL";

let currentMaterialId = 1;

const materialChangeReducer = (state, material) => {
  if (material.id) {
    const newMaterials = [...state.materials];
    const itemIndex = newMaterials.findIndex(m => m.id === material.id);
    const modifiedItem = { ...newMaterials[itemIndex], ...material };
    newMaterials[itemIndex] = modifiedItem;
    return { ...state, materials: newMaterials };
  } else {
    const newMaterial = { ...material, parts: [], id: currentMaterialId };
    currentMaterialId++;
    return {
      ...state,
      materials: [...state.materials, newMaterial]
    };
  }
};

const updatePartsReducer = (state, { materialId, parts }) => {
  const newMaterials = [...state.materials];
  const itemIndex = newMaterials.findIndex(m => m.id === materialId);
  const clonedMaterial = { ...newMaterials[itemIndex] };
  clonedMaterial.parts = parts;
  newMaterials[itemIndex] = clonedMaterial;
  return { ...state, materials: newMaterials };
};

const deleteMaterialReducer = (state, materialId) => {
  const newMaterials = state.materials.filter(m => m.id !== materialId);
  return { ...state, materials: newMaterials };
};

const reducer = (state, action) => {
  switch (action.type) {
    case MATERIAL_CHANGE:
      return materialChangeReducer(state, action.payload);
    case DELETE_MATERIAL:
      return deleteMaterialReducer(state, action.payload);
    case UPDATE_PARTS:
      return updatePartsReducer(state, action.payload);
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const StoreContext = React.createContext();

export function StoreProvider(props) {
  const initialState = { materials: [] };

  const [state, dispatch] = useReducer(reducer, initialState);

  const value = React.useMemo(() => [state, dispatch], [state]);

  return <StoreContext.Provider value={value} {...props} />;
}

export function useStore() {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be called with a StoreProvider");
  }

  const [state, dispatch] = context;

  return {
    state,
    dispatch,
    addPart: materialId => dispatch({ type: ADD_PART, payload: materialId }),
    updateParts: (materialId, parts) =>
      dispatch({
        type: UPDATE_PARTS,
        payload: { materialId, parts }
      }),
    deleteMaterial: materialId =>
      dispatch({ type: DELETE_MATERIAL, payload: materialId }),
    materialChanged: material =>
      dispatch({ type: MATERIAL_CHANGE, payload: material })
  };
}
