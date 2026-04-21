import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <ProjectContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);