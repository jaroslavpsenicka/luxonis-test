import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row, Progress } from 'reactstrap';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { DataContext } from '../contexts/DataContext';
import { Estate } from "../types";

import { Loading } from '../components/Loading'

import noResults from '../static/no-results.gif'

const StyledLoadingImage = styled(FontAwesomeIcon)`
  width: 20px !important;
  height: 20px;
  margin: 12px auto;
`

export default function MainPage() {

  const { estates, scraping, startScraping, stopScraping } = useContext(DataContext);

  const Estates = ({ data }: { data: Array<Estate>}) => (
    <>
      { data.map((e: Estate) => <div key={e.name}>{e.name} {e.image}</div>) }
    </>
  )

  const NoEstates = () => (
    <div className="mt-5 pt-5 text-center">
      <img src={noResults} alt="no results" />
      <div className="mt-2 text-center text-dark small">There were no estates gathered yet.<br/>Try collecting data from the estate server by pressing the button below.</div>
      <Button className="mt-4" color="secondary" onClick={startScraping}>Load Estate Data</Button>
    </div>
  )

  const EstateScraping = () => (
    <div className="mt-5 pt-5 text-center">
      <FontAwesomeIcon icon={faSpinner} size="4x" className="fa-pulse mb-3 d-block text-disabled mx-auto p-5" />
      <Progress className="my-3" style={{ height: '3px' }} value={scraping.progress} />
      <div className="text-center text-dark small">Estate data are being loaded from the estate server, please wait.</div>
      <Button className="mt-4" color="secondary" onClick={stopScraping}>Stop Loading</Button>
    </div>
  )

    console.log("scraping", scraping)

  return (
    <Container>
      <Row className="mt-5 pb-3">
        { estates.loading && <Loading text="Loading..." /> }
        { scraping.running && <EstateScraping /> }
        { !scraping.running && !estates?.loading && !estates?.data?.length && <NoEstates /> }
        { scraping.progress === 100 && !estates.loading && <Estates data={estates?.data} />}
        { scraping.error && <Alert color="danger" className="mt-4">Error loading data from the estate server: {scraping.error.message || scraping.error}</Alert> }
        { estates.error && <Alert color="danger" className="mt-4">Error loading data: {estates.error.message || estates.error}</Alert> }
      </Row>
    </Container>
  )

}

