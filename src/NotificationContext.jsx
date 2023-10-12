import { useReducer, createContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "VOTE":
      return `anecdote "${action.payload}" voted`;
    case "CREATE":
      return `anecdote "${action.payload}" created`;
    case "CLEAR":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    ""
  );
  return (
    <NotificationContext.Provider value={[notification, dispatchNotification]}>
      {props.children}
    </NotificationContext.Provider>
  )
};

export default NotificationContext
