export const initialStore = () => {
  return {
    token: localStorage.getItem("token") || null
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "LOGIN":
      return {
        ...store,
        token: action.payload,
      };
    
    case "LOGOUT":
      return {
        ...store,
        token: localStorage.getItem("token") || null,
      };

    default:
      throw Error("Unknown action.");
  }
}
