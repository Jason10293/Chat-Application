import React, { useState, useRef } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  function handleSave() {
    console.log(email);
  }
  function handleSaveAndClose() {
    handleSave();
    onClose();
  }
  return (
    <>
      <Button
        color="white"
        backgroundColor="#1a1a1a"
        width="100%"
        gridColumn="span 2"
        height="100%"
        fontSize="1.2vw"
        _hover={{ background: "rgb(32,28,28)" }}
        onClick={onOpen}
      >
        Add Friend
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">Add Friend</ModalHeader>
          <ModalCloseButton
            backgroundColor="#3884cc"
            _hover={{ background: "#306cb4" }}
          />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel color="black">Email</FormLabel>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color="black"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSaveAndClose} colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
