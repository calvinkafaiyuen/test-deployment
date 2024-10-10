import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Pagination, Spacer } from "@nextui-org/react";
import Select from 'react-select';
import { addAdvisor, getAllAdvisors, removeAdvisor } from "@/app/lib/actions/admin/programs.action";

interface BoardModalProps {
  isBoardModalOpen: boolean;
  setBoardModalOpen: (isOpen: boolean) => void;
  selectedRows: number;
  selectedRowsData: any;
}

const ManageAdvisoryBoardModal: React.FC<BoardModalProps> = ({ isBoardModalOpen, setBoardModalOpen, selectedRows, selectedRowsData }) => {
  const [page, setPage] = useState(1);

  const [mentors, setMentors] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [staff, setStaff] = useState([]);

  const [selectedMentors, setSelectedMentors] = useState([]);
  const [selectedConnectors, setSelectedConnectors] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);

  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (selectedRowsData) {
      setModalTitle(`${selectedRowsData[page - 1].team_name} (ID: ${selectedRowsData[page - 1].team_id})`);
      handlePageChange(1);
    }
  }, [isBoardModalOpen])

  useEffect(() => {
    if (selectedRowsData) {
      setModalTitle(`${selectedRowsData[page - 1].team_name} (ID: ${selectedRowsData[page - 1].team_id})`);
    }
  }, [page])

  const handleMultiSelectChange = async (newSelectedOptions: any, prevSelectedOptions: any, setOptions: any, type: string) => {
    const removedOptions = prevSelectedOptions.filter((option: any) => !newSelectedOptions.includes(option));
    const addedOptions = newSelectedOptions.filter((option: any) => !prevSelectedOptions.includes(option));

    try {
      if (removedOptions.length) {
        const option = removedOptions[0];
        if (type === 'c') {
          await removeAdvisor(selectedRowsData[page - 1].team_id, type, option.id);
        } else {
          await removeAdvisor(selectedRowsData[page - 1].team_id, type, option.email);
        }
      }
      if (addedOptions.length) {
        const option = addedOptions[0];
        if (type === 'c') {
          await addAdvisor(selectedRowsData[page - 1].team_id, type, option.id);
        } else {
          await addAdvisor(selectedRowsData[page - 1].team_id, type, option.email);
        }
      }
      setOptions(newSelectedOptions);
    } catch (e) {
      console.log(e);
    }

  };

  const handlePageChange = (newPage: any) => {
    getAllAdvisors(selectedRowsData[newPage - 1].team_id)
    .then((allAdvisors: any) => {
      const allMentors = allAdvisors.filter((a: any) => a.role === 'm');
      const allConnectors = allAdvisors.filter((a: any) => a.role === 'c');
      const allStaff = allAdvisors.filter((a: any) => a.role === 's');

      setMentors(allMentors);
      setConnectors(allConnectors);
      setStaff(allStaff);

      setSelectedMentors(allMentors.filter((a: any) => a.selected));
      setSelectedConnectors(allConnectors.filter((a: any) => a.selected));
      setSelectedStaff(allStaff.filter((a: any) => a.selected));
    })
    setPage(newPage);
  }

  return (
    <>
      <Modal 
        size="2xl"
        scrollBehavior="outside"
        isOpen={isBoardModalOpen} 
        onClose={() => setBoardModalOpen(false)} 
        isDismissable={false} 
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          <ModalHeader>
            {modalTitle}
          </ModalHeader>
          <ModalBody className="h-auto z-50">
          <div>
            <p className="font-bold">Manage Mentors</p>
            <Spacer y={2} />
            <Select
              isMulti
              isClearable={false}
              value={selectedMentors}
              onChange={(newMentors) => handleMultiSelectChange(newMentors, selectedMentors, setSelectedMentors, 'm')}
              options={mentors}
            />
          </div>
          <div>
            <p className="font-bold">Manage Connectors</p>
            <Spacer y={2} />
            <Select
              isMulti
              isClearable={false}
              value={selectedConnectors}
              onChange={(newConnectors) => handleMultiSelectChange(newConnectors, selectedConnectors, setSelectedConnectors, 'c')}
              options={connectors}
            />
          </div>
          <div>
            <p className="font-bold">Manage Staff</p>
            <Spacer y={2} />
            <Select
              isMulti
              isClearable={false}
              value={selectedStaff}
              onChange={(newStaff) => handleMultiSelectChange(newStaff, selectedStaff, setSelectedStaff, 's')}
              options={staff}
            />
          </div>
          </ModalBody>
          <ModalFooter>
            <Pagination 
              showControls 
              total={selectedRows} 
              initialPage={1} 
              onChange={(page) => handlePageChange(page)} 
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageAdvisoryBoardModal;
