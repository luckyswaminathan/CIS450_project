import {
    useDisclosure,
    MenuItem,
    Menu,
    MenuButton,
    MenuList,
} from "@chakra-ui/react"
import { useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom';

export default function TopicsBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Menu isOpen={isOpen}>
            <MenuButton
                name="Users"
                variant="ghost"
                mx={1}
                py={[1, 2, 2]}
                px={4}
                borderRadius={5}
                _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                aria-label="Courses"
                fontWeight="normal"
                fontSize={30}
                alignContent={"center"}
                onMouseEnter={onOpen}
                onMouseLeave={() => setTimeout(onClose, 500)}
            >
                Topics {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </MenuButton>
            <MenuList onMouseEnter={onOpen} onMouseLeave={() => setTimeout(onClose, 1000)}>
                <MenuItem>
                <Link to="/topics/political-affiliation" style={{ fontSize:20, textDecoration: 'none', color: 'inherit' }}>
                Political Affiliations
                </Link>
                </MenuItem>
                <MenuItem> <Link to="/topics/political-keywords" style={{ fontSize:20, textDecoration: 'none', color: 'inherit' }}>
                Keywords of Political Affiliations
                </Link>
                </MenuItem>
                <MenuItem>
                <Link to="/topics/state-affiliation" style={{  fontSize:20, textDecoration: 'none', color: 'inherit' }}>
                State Political Affiliations
                </Link>
                </MenuItem>
            </MenuList>
        </Menu>
    )
}