import { useContext, useEffect, useState } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';

import { DataContext } from '../contexts/DataContext';
import { Estate } from "../types";

import { Loading } from '../components/Loading'

export default function DashboardPage() {

  const { estates, scrapingInProgress } = useContext(DataContext);

  const Estates = ({ data }: { data: Array<Estate>}) => (
    <>
      { data.map((e: Estate) => <div key={e.name}>{e.name} {e.image}</div>) }
    </>
  )

  const NoEstates = () => (
    <div className="mt-5 text-center text-dark small">There are no estates.</div>
  )

  return (
    <Container>
      <Row className="pb-3">
        {/* { estates.error && <Alert color="danger" className="mt-4">Error loading data: {estates.error.message || estates.error}</Alert> } */}
        { scrapingInProgress && <Loading text="Scraping..." /> }
        { !estates.error && !scrapingInProgress && !estates?.data?.length && <NoEstates /> }
        { !estates.error && !scrapingInProgress && estates?.data?.length && <Estates data={estates?.data} /> }
      </Row>
    </Container>
  )

}

