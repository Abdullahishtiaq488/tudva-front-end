"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Collapse, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavItem } from "react-bootstrap";
import { BsGridFill, BsHeart } from "react-icons/bs";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import NotificationDropdown from "@/components/common/NotificationDropdown";
import LogoBox from "@/components/LogoBox";
import ProfileDropdown from "@/components/TopNavbar/components/ProfileDropdown";
import useScrollEvent from "@/hooks/useScrollEvent";
import useToggle from "@/hooks/useToggle";
import avatar3 from '@/assets/images/avatar/03.jpg';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { checkIsLoggedInUser } from "@/helpers/checkLoggedInUser";

const homePageItems = [
  {
    menuItem: 'Languages & Communication',
    menuLink: 'courses?search=&category=Languages',
    submenuItems: [
      {
        menuItem: 'Forigen Languages',
        menuLink: 'courses?search=&category=Forigen',
      },
      {
        menuItem: 'Learning the National Language',
        menuLink: 'courses?search=&category=Learning',
      },
      {
        menuItem: 'Rhetoric & International Communicationcom',
        menuLink: 'courses?search=&category=Rhetoric',
      },
    ]
  },
  {
    menuItem: 'Cooking & Household',
    menuLink: 'courses?search=&category=Cooking',
    submenuItems: [
      {
        menuItem: 'Cooking & Baking (including International Cuisine)',
        menuLink: 'courses?search=&category=Cooking',
      },
      {
        menuItem: 'Nutrition & Sustainability',
        menuLink: 'courses?search=&category=Nutrition',
      },
      {
        menuItem: 'Home Economics',
        menuLink: 'courses?search=&category=Home',
      },
    ]
  },
  {
    menuItem: 'Creativity & Craftsmanship',
    menuLink: 'courses?search=&category=Creativity',
    submenuItems: [
      {
        menuItem: 'Painting, Drawing, Photography',
        menuLink: 'courses?search=&category=Painting',
      },
      {
        menuItem: 'Sewing, Crafting, DIY',
        menuLink: 'courses?search=&category=Sewing',
      },
      {
        menuItem: 'Arts & More',
        menuLink: 'courses?search=&category=Arts',
      },
    ]
  },
  {
    menuItem: 'Digital & IT',
    menuLink: 'courses?search=&category=Digital',
    submenuItems: [
      {
        menuItem: 'Computers & Internet',
        menuLink: 'courses?search=&category=Computers',
      },
      {
        menuItem: 'Social Media & Data Protection',
        menuLink: 'courses?search=&category=Social',
      },
      {
        menuItem: 'Software & Tools',
        menuLink: 'courses?search=&category=Software',
      },
    ]
  },
  {
    menuItem: 'Health & Exercise',
    menuLink: 'courses?search=&category=Health',
    submenuItems: [
      {
        menuItem: 'Fitness, Yoga & More',
        menuLink: 'courses?search=&category=Fitness',
      },
      {
        menuItem: 'Relaxation & Stress Management',
        menuLink: 'courses?search=&category=Relaxation',
      },
      {
        menuItem: 'Prevention & Well-being',
        menuLink: 'courses?search=&category=Prevention',
      },
    ]
  },
  {
    menuItem: 'Nature & Gardening',
    menuLink: 'courses?search=&category=Nature',
    submenuItems: [
      {
        menuItem: 'Gardening & Urban Gardening',
        menuLink: 'courses?search=&category=Gardening',
      },
      {
        menuItem: 'Environment & Sustainability',
        menuLink: 'courses?search=&category=Environment',
      },
      {
        menuItem: 'Eco Projects',
        menuLink: 'courses?search=&category=Eco',
      },
    ]
  },
  {
    menuItem: 'Career & Education',
    menuLink: 'courses?search=&category=Career',
    submenuItems: [
      {
        menuItem: 'Soft Skills & Time Management',
        menuLink: 'courses?search=&category=Soft',
      },
      {
        menuItem: 'Career Orientation & Qualification',
        menuLink: 'courses?search=&category=Career',
      },
      {
        menuItem: 'Basic Education & Literacy',
        menuLink: 'courses?search=&category=Basic',
      },
    ]
  },
]

const otherPagesMenuItem = [
  {
    menuItem: 'all courses on tudva',
    menuLink: 'courses?search=&category=all',
    submenuItems: []
  },
  {
    menuItem: 'my corriculm',
    menuLink: 'courses?search=&category=my',
    submenuItems: []
  },
  {
    menuItem: 'my documents',
    menuLink: 'courses?search=&category=my',
    submenuItems: []
  },
  {
    menuItem: 'my support',
    menuLink: 'courses?search=&category=my',
    submenuItems: [
      {
        menuItem: 'First Steps',
        menuLink: 'courses?search=&category=First',
      },
      {
        menuItem: 'Tutorials',
        menuLink: 'courses?search=&category=Tutorials',
      },
      {
        menuItem: 'Help Center',
        menuLink: 'courses?search=&category=/help',
      },
      {
        menuItem: 'Help Community',
        menuLink: 'courses?search=&category=help',
      },
    ]
  },
]


const TopNavigationBar = () => {
  const {
    scrollY
  } = useScrollEvent();
  const {
    isTrue: isOpen,
    toggle
  } = useToggle();
  const {
    isTrue: isOpenCategory,
    toggle: toggleCategory
  } = useToggle();

  const pathname = usePathname();
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const menuItems = pathname === '/' ? homePageItems : otherPagesMenuItem;

  const getUsersData = async () => {
    setIsLoading(true)
    const { user, error } = await checkIsLoggedInUser();
    console.log(user, 'user')
    if (error) {
      setIsLoading(false)
      setIsLoggedInUser(null)
    }
    if (user) {
      setIsLoading(false)
      setIsLoggedInUser(user);
    } else {
      setIsLoading(false)
      setIsLoggedInUser(null)
    }
  }

  useEffect(() => {
    getUsersData();
  }, [])

  // Check if we're on the courses page to always show white background
  const isCoursesPage = pathname === '/courses';

  return <>
    <header className={clsx("navbar-light navbar-sticky bg-white", { 'navbar-sticky-on': scrollY >= 400 || isCoursesPage })}>
      <nav className="navbar navbar-expand-xl">
        <Container>
          <LogoBox height={36} width={170} />
          <button onClick={toggle} className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-animation">
              <span />
              <span />
              <span />
            </span>
          </button>
          <Collapse in={isOpen} className="navbar-collapse justify-content-center">
            <div>
              <Col md={8}>
                <div className="nav my-3 my-xl-0 px-4 flex-nowrap align-items-center">
                  <div className="nav-item w-100">
                    <form className="rounded position-relative">
                      <input className="form-control pe-5 bg-secondary bg-opacity-10 border-0" type="search" placeholder="Search" aria-label="Search" />
                      <button className="btn btn-link bg-transparent px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit"><FaSearch className="fs-6 text-primary" /></button>
                    </form>
                  </div>
                </div>
              </Col>
            </div>
          </Collapse>
          <ul className="nav flex-row justify-content-center align-items-center list-unstyled ms-xl-auto">
            <Button size="sm" variant="danger-soft" className="mb-0 !mr-2 px-4">My Learning</Button>
            <li className="nav-item ms-0 ms-sm-2 d-none d-sm-block">
              <Link className="btn btn-light btn-round mb-0" href="/shop/wishlist"> <BsHeart className="fa-fw" /></Link>
            </li>
            <NotificationDropdown />
            {isLoggedInUser !== null ?
              <ProfileDropdown isLoggedInUser={isLoggedInUser} className="nav-item ms-3" />
              :
              <Button href={'/auth/sign-up'} size="sm" variant="primary" className="mb-0 ms-3 px-4">Join Us</Button>
            }
          </ul>
        </Container>
      </nav>
      <hr className="my-0" />
      <nav className="navbar navbar-expand-xl nav-category bg-white">
        <Container className="px-0">
          <button onClick={toggleCategory} className="navbar-toggler m-auto w-100" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse2" aria-controls="navbarCollapse2" aria-expanded="false" aria-label="Toggle navigation">
            <BsGridFill /> Category
          </button>
          <Collapse in={isOpenCategory} className="navbar-collapse w-100">
            <div>
              <ul className="navbar-nav navbar-nav-scroll mx-auto">
                {menuItems.map((item, index) => (
                  item.submenuItems && item.submenuItems.length > 0 ? (
                    <Dropdown key={index} className="nav-item" role="button">
                      <DropdownToggle as='a' className="nav-link arrow-none active">
                        {item.menuItem}
                        <FaChevronDown className="ms-1" size={10} />
                      </DropdownToggle>
                      <ul className="dropdown-menu" aria-labelledby={`dropdownMenu-${index}`}>
                        {item.submenuItems.map((subitem, subindex) => (
                          <li key={subindex}>
                            <DropdownItem href={subitem.menuLink || "#"}> {/* Use menuLink, fallback to # */}
                              {subitem.menuItem}
                            </DropdownItem>
                          </li>
                        ))}
                      </ul>
                    </Dropdown>
                  ) : (
                    <NavItem key={index}>
                      <a className="nav-link" href={item.menuLink || "#"}> {/* Use menuLink, fallback to # */}
                        {item.menuItem}
                      </a>
                    </NavItem>
                  )
                ))}
              </ul>
            </div>
          </Collapse>
        </Container>
      </nav>
    </header>
  </>;
};
export default TopNavigationBar;
