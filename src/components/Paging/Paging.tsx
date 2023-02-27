import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

interface PagingType {
  pageCount: number
  selectedPage: number
  onChange: (selectedPage: number) => void
}

export function Paging({pageCount, selectedPage, onChange}: PagingType) {

  const PagingItem = ({ idx, active, onClick }: { idx: number, active: boolean, onClick: () => void }) => (
    <PaginationItem active={active}>
      <PaginationLink href="#" className={active ? 'bg-dark text-white' : 'bg-white text-dark'} onClick={onClick}>{idx+1}</PaginationLink>
    </PaginationItem>
  ) 

  if (pageCount < 2) return null;

  return (
    <Pagination className="text-dark">
      <PaginationItem disabled={selectedPage < 1} >
        <PaginationLink first href="#" className="bg-white text-dark" onClick = {() => onChange(0)} />
      </PaginationItem>
      <PaginationItem disabled={selectedPage < 1} onClick = {() => onChange(selectedPage-1)}>
        <PaginationLink previous href="#" className="bg-white text-dark" />
      </PaginationItem>

      { new Array(pageCount).fill().map((v, i) => <PagingItem key={i} idx={i} active={i===selectedPage} onClick = {() => onChange(i)}/>) }

      <PaginationItem disabled={selectedPage > pageCount-2}>
        <PaginationLink next href="#" className="bg-white text-dark" onClick = {() => onChange(selectedPage+1)} />
      </PaginationItem>
      <PaginationItem disabled={selectedPage > pageCount-2}>
        <PaginationLink last href="#" className="bg-white text-dark" onClick = {() => onChange(pageCount-1)} />
      </PaginationItem>
    </Pagination>
  )
}

