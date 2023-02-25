import { useState, useContext } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavbarText,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

export function Header() {
  
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar dark fixed="top" expand="xs" className="navbar-dark bg-primary">
      <NavbarBrand className="ms-3 text-disabled" href="/">Luxonis TEST App</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mx-auto" navbar>
          <NavItem>
            <NavLink href="/" className="d-none d-sm-block">Estates</NavLink>
          </NavItem>
        </Nav>
        <NavbarText>
          <a href="https://github.com/jaroslavpsenicka/luxonis-test" target="_new">
            <FontAwesomeIcon icon={faGithub} className="text-info me-3" size="2x" />
          </a>
        </NavbarText>
      </Collapse>
    </Navbar>
  )

}

