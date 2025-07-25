export const initialStore = () => {
  return {
    token: localStorage.getItem("token") || null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...store,
        token: action.payload,
      };

    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...store,
        token: null,
      };

    default:
      throw Error("Unknown action.");
  }
}
