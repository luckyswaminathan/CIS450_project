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

export default function EngagementBar() {
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
                onMouseLeave={() => setTimeout(onClose, 1000)}
            >
                Engagement {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </MenuButton>
            <MenuList onMouseEnter={onOpen} onMouseLeave={() => setTimeout(onClose, 1000)}>
                <MenuItem>
                <Link to="/engagement/user-engagement" style={{ fontSize:20, textDecoration: 'none', color: 'inherit' }}>
                    User Engagement Comparison
                </Link>
                </MenuItem>
                <MenuItem> <Link to="/engagement/politican-comparison" style={{ fontSize:20, textDecoration: 'none', color: 'inherit' }}>
                Politican Engagement Comparison
                </Link>
                </MenuItem>

            </MenuList>
        </Menu>
    )
}