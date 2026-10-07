import { createContext, useState } from "react";

// Shared list of the user's reports; loading/error state lives in the pages that trigger each request.
export const InterviewContext = createContext();
export const InterviewProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  return (
    <InterviewContext.Provider value={{ reports, setReports }}>
      {children}
    </InterviewContext.Provider>
  );
};
