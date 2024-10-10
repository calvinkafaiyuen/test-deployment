import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { verifyPassword } from "../(utils)/helpers";

interface DeleteModalProps {
  isDeleteModalOpen: boolean;
  setDeleteModalOpen: (isOpen: boolean) => void;
  deleteSelectedRows: () => void;
}


const DeleteSelectedModal: React.FC<DeleteModalProps> = ({ isDeleteModalOpen, setDeleteModalOpen, deleteSelectedRows }) => {
  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleCloseDeleteModal = () => {
    setError("");
    setPassword("");
    setDeleteModalOpen(false);
  }

  const handleDelete = () => {
    if (!verifyPassword(password)) {
      setError("Invalid password")
      return;
    }
    deleteSelectedRows();
    handleCloseDeleteModal();
  }

  return (
    <Modal 
      isOpen={isDeleteModalOpen} 
      onOpenChange={handleCloseDeleteModal}
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Delete Applications</ModalHeader>
        <ModalBody>
          <Input
            label="Password"
            placeholder="Enter the password for deletion"
            type="password"
            variant="bordered"
            value={password}
            onValueChange={setPassword}
          />
          {error && (
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={handleCloseDeleteModal}>
            Close
          </Button>
          <Button color="primary" onPress={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteSelectedModal;
