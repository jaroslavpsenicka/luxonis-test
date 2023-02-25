import { useState, useEffect, createContext, useContext } from "react";
import Axios from "axios";

import { Estate, Loadable } from '../types'

interface DataContextType {
  estates: Loadable<Estate>
  scrapingInProgress: boolean
  reloadEstates: () => Promise<void>
  cancelReload: () => Promise<void>
}

const loadableEstates: Loadable<Estate> = { loading: true }
const initialContext: DataContextType = {
  estates: loadableEstates,
  scrapingInProgress: false,
  reloadEstates: () => Promise.resolve(),
  cancelReload: () => Promise.resolve()
}
const DataContext = createContext<DataContextType>(initialContext);
const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

function DataProvider({ children }: any) {

  const [ estates, setEstates ] = useState<Loadable<Estate>>({ loading: true })
  const [ scrapingInProgress, setScrapingInProgress ] = useState<boolean>(false)

  useEffect(() => {
    setEstates(() => ({ loading: true }))
    Axios.get(`${SERVICE_URL}/api/estates`)
      .then(response => setEstates({ loading: false, data: response.data }))
      .catch(err => setEstates({ loading: false, error: err }))

  }, [])

  const reloadEstates = (): Promise<void> => Axios.post(`${SERVICE_URL}/api/scrape`)
  const cancelReload = (): Promise<void> => Axios.delete(`${SERVICE_URL}/api/scrape`)


  return (
    <DataContext.Provider value={{
      estates,
      scrapingInProgress,
      reloadEstates,
      cancelReload
    }}>{children}</DataContext.Provider>
  );
}

export { DataContext, DataProvider };
