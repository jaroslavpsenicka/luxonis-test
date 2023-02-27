import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row, Progress, Card, CardBody, CardTitle, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faRefresh } from '@fortawesome/free-solid-svg-icons'

import { DataContext } from '../contexts/DataContext';
import { Estate } from "../types";

import { Loading } from '../components/Loading'
import { Paging } from '../components/Paging'

import noResults from '../static/no-results.gif'

const StyledLoadingImage = styled(FontAwesomeIcon)`
  width: 20px !important;
  height: 20px;
  margin: 12px auto;
`

export default function MainPage() {

  const { estates, estatePage, setEstatePage, estatePageSize, scraping, startScraping, stopScraping } = useContext(DataContext);

  const Estates = ({ data }: { data: Array<Estate>}) => (
    <div className="mt-5">
      <h2 className="text-dark fw-light w-100">
        <span>Estates</span>
        <FontAwesomeIcon icon={faRefresh} className="float-end mt-2 cursor-pointer" size="sm" onClick={startScraping} />
      </h2>
      <div className="d-flex flex-wrap mt-2 p-3 justify-content-between bg-white">
        { data.entities.map((e: Estate) => <Estate key={e.name} name={e.name} image={e.image} />) }
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Paging pageCount={estates.data?.count ? Math.ceil(estates.data.count/estatePageSize) : 0} selectedPage={estatePage} 
          onChange={(page) => setEstatePage(page)} />
      </div>
    </div>
  )

  const Estate = ({ name, image }: { name: string, image: string }) => (
    <Card className="m-3" style={{ width: '10rem' }}>
      <img alt={name} src={image} />
      <CardBody>
        <CardTitle tag="h5">{name}</CardTitle>
      </CardBody>
    </Card>
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

  return (
    <Container>
      <Row className="mt-5 p-3">
        { scraping.error && <Alert color="danger" className="mt-4">Error loading data from the estate server: {scraping.error.message || scraping.error}</Alert> }
        { estates.error && <Alert color="danger" className="mt-4">Error loading data: {estates.error.message || estates.error}</Alert> }
        { estates.loading && <Loading text="Loading..." /> }
        { scraping.running && <EstateScraping /> }
        { !scraping.running && !estates?.loading && !estates?.data?.count && <NoEstates /> }
        { !scraping.running && estates?.data?.count > 0 && <Estates data={estates?.data} /> }
      </Row>
    </Container>
  )

}

