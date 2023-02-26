import { useState, useEffect, createContext, useContext } from "react";
import Axios from "axios";

import { Estate, Loadable } from '../types'

interface DataContextType {
  estates: Loadable<Estate>
  scraping: ScrapingType
  startScraping: () => Promise<void>
  stopScraping: () => Promise<void>
}

interface ScrapingType {
  running: boolean
  progress?: number
  error?: Error
}

const loadableEstates: Loadable<Estate> = { loading: true }
const initialContext: DataContextType = {
  estates: loadableEstates,
  scraping: { running: false },
  startScraping: () => Promise.resolve(),
  stopScraping: () => Promise.resolve()
}
const DataContext = createContext<DataContextType>(initialContext);
const SERVICE_URL = process.env.REACT_APP_SERVICE_URL;

let eventSource = undefined;

function DataProvider({ children }: any) {

  const [ estates, setEstates ] = useState<Loadable<Estate>>({ loading: true })
  const [ scraping, setScraping ] = useState<ScrapingType>({ running: false })

  useEffect(() => loadEstates(), [])

  useEffect(() => {
    if (scraping.running && scraping.progress >= 100) {
      setScraping({ ...scraping, running: false });
      loadEstates()
    }
  }, [scraping])

  const loadEstates = () => {
    setEstates(() => ({ loading: true }))
    Axios.get(`${SERVICE_URL}/api/estates`)
      .then(response => setEstates({ loading: false, data: response.data }))
      .catch(err => setEstates({ loading: false, error: err }))
  }

  const watchScraping = () => {
    eventSource = new EventSource(`${SERVICE_URL}/api/scraping`);
    eventSource.addEventListener('scraping-progress', (event) => setScraping({ running: parseInt(event.data) < 100, progress: parseInt(event.data)}));
    eventSource.addEventListener('error', (err) => setScraping({ running: false, error: err }));
  }

  const startScraping = (): Promise<void> => Axios.post(`${SERVICE_URL}/api/scraping`)
    .then(() => setScraping({ running: true }))
    .then(() => watchScraping())
    .catch(err => setScraping({ running: false, error: err }))

  const stopScraping = (): Promise<void> => Axios.delete(`${SERVICE_URL}/api/scraping`)
    .then(() => setScraping({ running: false }))
    .then(() => { eventSource?.close(); eventSource = undefined; })

  return (
    <DataContext.Provider value={{
      estates,
      scraping,
      startScraping,
      stopScraping
    }}>{children}</DataContext.Provider>
  );
}

export { DataContext, DataProvider };
