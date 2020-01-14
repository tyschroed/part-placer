import React, { useReducer } from "react";
import PropTypes from "prop-types";
import { useAnalytics } from "./Analytics";

// mutations
const MATERIAL_CHANGE = "MATERIAL_CHANGE";
const ADD_PART = "ADD_PART";
const UPDATE_PARTS = "UPDATE_PARTS";
const DELETE_MATERIAL = "DELETE_MATERIAL";
const RESET_STATE = "RESET_STATE";
const ACKNOWLEDGE_WELCOME = "ACKNOWLEDGE_WELCOME";
const HYDRATE = "HYDRATE";
const SET_KERF = "SET_KERF";
const SET_ROTATION = "SET_ROTATION";

export const defaultInitialState = {
  materials: [],
  showWelcome: true,
  shared: false,
  allowRotation: true,
  kerfSize: '1/8"'
};

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
    case SET_KERF:
      return { ...state, kerfSize: action.payload };
    case SET_ROTATION:
      return { ...state, allowRotation: action.payload };
    case HYDRATE:
      return { ...action.payload, showWelcome: state.showWelcome };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const StoreContext = React.createContext();
const STORAGE_KEY = "StoreContext";

const saveState = state =>
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

export function StoreProvider({ value: overrideState, ...props }) {
  let initialState = defaultInitialState;
  if (overrideState) {
    initialState = overrideState;
    saveState(initialState);
  } else {
    const savedState = window.localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      initialState = JSON.parse(savedState);
      // kerf size added post-launch, so add to any states being loaded that don't have it set
      if (!initialState.kerfSize) {
        initialState.kerfSize = defaultInitialState.kerfSize;
      }
      if (!initialState.allowRotation) {
        initialState.allowRotation = defaultInitialState.allowRotation;
      }
    }
  }

  const localStorageEnabledReducer = (...args) => {
    const updatedState = reducer(...args);
    saveState(updatedState);
    return updatedState;
  };

  const [state, dispatch] = useReducer(
    localStorageEnabledReducer,
    initialState
  );

  const value = React.useMemo(() => {
    return [state, dispatch];
  }, [state]);

  return <StoreContext.Provider value={value} {...props} />;
}

StoreProvider.propTypes = { value: PropTypes.object };

function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)));
}

export function useStore() {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be called with a StoreProvider");
  }

  const [state, dispatch] = context;
  const { event } = useAnalytics();

  return {
    state,
    dispatch,
    addPart: materialId => {
      event({ category: "Parts", action: "Add Part" });
      return dispatch({ type: ADD_PART, payload: materialId });
    },
    encodeState: () => utoa(window.localStorage.getItem(STORAGE_KEY)),
    updateParts: (materialId, parts) => {
      event({ category: "Parts", action: "Update Parts" });
      return dispatch({
        type: UPDATE_PARTS,
        payload: { materialId, parts }
      });
    },
    deleteMaterial: materialId => {
      event({ category: "Parts", action: "Delete Material" });
      return dispatch({ type: DELETE_MATERIAL, payload: materialId });
    },
    materialChanged: material => {
      event({
        category: "Parts",
        action: material.id ? "Material Updated" : "Material Added"
      });
      return dispatch({ type: MATERIAL_CHANGE, payload: material });
    },
    resetState: () => {
      event({
        category: "Parts",
        action: "Reset"
      });
      return dispatch({ type: RESET_STATE });
    },
    hydrate: state => {
      return dispatch({ type: HYDRATE, payload: state });
    },
    setKerf: kerfSize => {
      return dispatch({ type: SET_KERF, payload: kerfSize });
    },
    setRotation: rotationAllowed => {
      return dispatch({ type: SET_ROTATION, payload: rotationAllowed });
    },
    acknowledgeWelcome: () => {
      event({
        category: "Parts",
        action: "Welcome acknowledged"
      });
      return dispatch({ type: ACKNOWLEDGE_WELCOME });
    }
  };
}
