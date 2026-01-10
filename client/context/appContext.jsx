import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

// Define the context with default undefined
export const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [event, setEvent] = useState(undefined);

  return (
    <AppContext.Provider value={{ event, setEvent }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};