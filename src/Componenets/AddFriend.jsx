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
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Header({ addFriend }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState();
  const usersRef = collection(db, "users");
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  async function handleSave() {
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      //Get user information
      const data = querySnapshot.docs[0].data();
      const displayName = data.displayName;
      const pfp = data.pfp;
      const uid = data.uid;
      addFriend(displayName, pfp, uid);
    } else {
      //Make a modal that shows not found?
      console.log("not found");
    }
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
        height="100%"
        fontSize="1.2vw"
        gridRow="span 1"
        gridRowEnd="11"
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
                onChange={(e) => setEmail(e.target.value)}
                color="black"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSaveAndClose} colorScheme="blue" mr={3}>
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
