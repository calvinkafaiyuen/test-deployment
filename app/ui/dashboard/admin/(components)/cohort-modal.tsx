import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { cohorts } from "../(data)/data";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { verifyPassword } from "../(utils)/helpers";

interface ChangeCohortModalProps {
  isCohortModalOpen: boolean;
  setCohortModalOpen: (isOpen: boolean) => void;
  changeCohorts: (cohort: string) => void;
}


const ChangeCohortModal: React.FC<ChangeCohortModalProps> = ({ isCohortModalOpen, setCohortModalOpen, changeCohorts }) => {
  
  const [cohort, setCohort] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleCloseCohortModal = () => {
    setError("");
    setPassword("");
    setCohort("");
    setCohortModalOpen(false);
  }

  const handleChangeCohorts = () => {
    if (!verifyPassword(password)) {
      setError("Invalid password");
      return;
    }

    if (cohort === '') {
      setError("Please select a cohort");
      return;
    }

    if (typeof changeCohorts !== 'function') {
      setError("Cohorts can only be updated for programs data")
      return;
    }

    changeCohorts(cohort);
    handleCloseCohortModal();
  }

  return (
    <Modal 
      isOpen={isCohortModalOpen} 
      onOpenChange={handleCloseCohortModal}
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Change Cohorts</ModalHeader>
        <ModalBody>
          <Input
            label="Password"
            placeholder="Enter the password for modification"
            type="password"
            variant="bordered"
            value={password}
            onValueChange={setPassword}
          />
          <Select
            label="Cohorts"
            placeholder="Select a cohort"
            onChange={(e) => setCohort(e.target.value)}
          >
            {cohorts.map((cohort) => (
              <SelectItem key={cohort}>
                {cohort}
              </SelectItem>
            ))}
          </Select>
          {error && (
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={handleCloseCohortModal}>
            Close
          </Button>
          <Button color="primary" onPress={handleChangeCohorts}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeCohortModal;
