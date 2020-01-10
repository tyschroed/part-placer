import React, { useReducer } from "react";
import PropTypes from "prop-types";

// mutations
const MATERIAL_CHANGE = "MATERIAL_CHANGE";
const ADD_PART = "ADD_PART";
const UPDATE_PARTS = "UPDATE_PARTS";
const DELETE_MATERIAL = "DELETE_MATERIAL";
const RESET_STATE = "RESET_STATE";
const ACKNOWLEDGE_WELCOME = "ACKNOWLEDGE_WELCOME";

const defaultInitialState = { materials: [], showWelcome: true };

const getId = materials =>
  materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1;

const materialChangeReducer = (state, material) => {
  if (material.id) {
    const newMaterials = [...state.materials];
    const itemIndex = newMaterials.findIndex(m => m.id === material.id);
    const modifiedItem = { ...newMaterials[itemIndex], ...material };
    newMaterials[itemIndex] = modifiedItem;
    return { ...state, materials: newMaterials };
  } else {
    const newMaterial = { ...material, parts: [], id: getId(state.materials) };
    return {
      ...state,
      materials: [...state.materials, newMaterial],
      showWelcome: false
    };
  }
};

const updatePartsReducer = (state, { materialId, parts }) => {
  const newMaterials = [...state.materials];
  const itemIndex = newMaterials.findIndex(m => m.id === materialId);
  const clonedMaterial = { ...newMaterials[itemIndex] };
  const updatedParts = parts.map(p => ({ ...p, isNew: false }));
  clonedMaterial.parts = updatedParts;
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
    case RESET_STATE:
      return { ...defaultInitialState, showWelcome: state.showWelcome };
    case ACKNOWLEDGE_WELCOME:
      return { ...state, showWelcome: false };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const StoreContext = React.createContext();

export function StoreProvider({ value: overrideState, ...props }) {
  let initialState = defaultInitialState;
  if (overrideState) {
    initialState = overrideState;
  } else {
    const savedState = window.localStorage.getItem("StoreContext");
    if (savedState) {
      initialState = JSON.parse(savedState);
    }
  }

  const localStorageEnabledReducer = (...args) => {
    const updatedState = reducer(...args);
    window.localStorage.setItem("StoreContext", JSON.stringify(updatedState));
    return updatedState;
  };

  const [state, dispatch] = useReducer(
    localStorageEnabledReducer,
    initialState
  );

  const value = React.useMemo(() => [state, dispatch], [state]);

  return <StoreContext.Provider value={value} {...props} />;
}

StoreProvider.propTypes = { value: PropTypes.object };

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
      dispatch({ type: MATERIAL_CHANGE, payload: material }),
    resetState: () => dispatch({ type: RESET_STATE }),
    acknowledgeWelcome: () => dispatch({ type: ACKNOWLEDGE_WELCOME })
  };
}
