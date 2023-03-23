import React from "react";

import {
  Box,
  Select,
  Container,
  Heading,
  HStack,
  Text,
  Button,
  background,
} from "@chakra-ui/react";

const Header = () => {
  return (
    <Box bgColor={"blackAlpha.900"} w="full" p={"4"}>
      <HStack>
        <Button variant={"unstyled"} color={"whiteAlpha.900"}>
          Home
        </Button>
        <Button>About</Button>
      </HStack>
    </Box>
  );
};

export default Header;
