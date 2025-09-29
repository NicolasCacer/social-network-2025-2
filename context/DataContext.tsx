import { createContext, useState } from "react";
import { supabase } from "../utils/supabase";

interface DataContextProps {
  profiles: any[];
  getProfiles: () => Promise<{ data: any[] | null; error: any }>;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [profiles, setProfiles] = useState<any[]>([]);

  const getProfiles = async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.error("Error fetching profiles:", error);
      return { data: null, error };
    }

    setProfiles(data || []);
    return { data, error };
  };

  return (
    <DataContext.Provider
      value={{
        profiles,
        getProfiles,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
