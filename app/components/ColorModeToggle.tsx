"use client";

import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { Moon, Sun } from 'lucide-react';

export default function ColorModeToggle() {
    const { toggleColorMode } = useColorMode();
    const icon = useColorModeValue(<Moon />, <Sun />);
    
    return (
        <IconButton
            aria-label="Toggle dark mode"
            icon={icon}
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="purple"
        />
    );
} 