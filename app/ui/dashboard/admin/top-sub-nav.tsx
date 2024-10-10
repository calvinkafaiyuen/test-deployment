import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, useDisclosure } from "@nextui-org/react";
import {
    PlusIcon, QueueListIcon, ArrowDownTrayIcon, XMarkIcon, FunnelIcon,
    EllipsisHorizontalCircleIcon, ArrowPathRoundedSquareIcon, UserGroupIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { useState } from "react";
import ManageAdvisoryBoardModal from "./(components)/board-modal";
import ChangeCohortModal from "./(components)/cohort-modal";
import DeleteSelectedModal from "./(components)/delete-modal";
import FeedbackModal from "./(components)/feedback-modal";

interface TopSubNavigationProps {
    fetchApps: (pathname: string, searchQuery: string, status?: string) => Promise<any[] | string>;
    clearFilters: () => void;
    selectedRows: number;
    selectedRowsData: any;
    gridApi:any,
    pathname:string
    setRowData: any;
    setColumnDefs?: any;
    deleteSelectedRows: any;
    changeCohorts?: any;
}

const getPage = (pathname: string) => {
  const parts = pathname.split('/').filter(part => part !== '');
  const optionIndex = parts.indexOf('admin');
  return parts[optionIndex + 1];
}

export default function TopSubNavigation ({ fetchApps, clearFilters, selectedRows, selectedRowsData, gridApi, pathname, setRowData, setColumnDefs, deleteSelectedRows, changeCohorts }:TopSubNavigationProps) {
    
  const page = getPage(pathname);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    fetchApps(pathname, searchQuery)
    .then((data:any) => {
      setColumnDefs?.(data.columnDefs || []);
      setRowData(data.rowData || []);
    });
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const downloadExcel = () => {
        console.log("Attempting to download Excel...");
        if (gridApi) {
            const selectedNodes = gridApi.getSelectedNodes();
            const parts = pathname.split('/').filter(part => part !== '');
            const table = parts[parts.length - 1];  // Corrected to access the last element
    
            // Format current date and time
            const now = new Date();
            const dateTime = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    
            if (selectedNodes && selectedNodes.length > 0) {
                // Only selected rows
                gridApi.exportDataAsExcel({
                    onlySelected: true,
                    fileName: `${table}_filtered_${dateTime}.xlsx`
                });
            } else {
                // All rows because no rows are selected
                gridApi.exportDataAsExcel({
                    fileName: `${table}_all_${dateTime}.xlsx`
                });
            }
        } else {
            console.log("Grid API not available.");
        }
    };    

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isCohortModalOpen, setCohortModalOpen] = useState(false);
    const [isBoardModalOpen, setBoardModalOpen] = useState(false);
    const [feedbackTitle, setFeedbackTitle] = useState("");
    const [feedbackText, setFeedbackText] = useState("");
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const isProgramsPage = () => {
      if (page !== "programs") {
        setFeedbackTitle("Error")
        setFeedbackText("This action can only be performed on data within the programs tab.");
        onOpen();
        return false;
      }
      return true;
    }

    const hasSelectedRows = () => {
      if (selectedRows === 0) {
        setFeedbackTitle("Error")
        setFeedbackText("No rows have been selected.");
        onOpen();
        return false;
      }
      return true;
    }

    const handleOpenDeleteModal = () => {
      if (!hasSelectedRows()) return;
      setDeleteModalOpen(true);
    }

    const handleOpenCohortModal = () => {
      if (!isProgramsPage()) return;
      if (!hasSelectedRows()) return;
      setCohortModalOpen(true);
    }

    const handleOpenBoardModal = () => {
      if (!isProgramsPage()) return;
      if (!hasSelectedRows()) return;
      setBoardModalOpen(true);
    }
    
    return (
        <div id="top-subnavigation" className="flex flex-row flex-wrap align-middle mb-4 text-lg text-[#4b5563] items-center w-full">
            <Button
                color="default" variant="light"
                size="sm"
                radius="sm" 
                className="mx-2"
                onClick={() => fetchApps(pathname, "")}
            >
                <PlusIcon className="h-[18px] w-[18px]"></PlusIcon>New
            </Button>
            <Button
                color="default" variant="light"
                size="sm"
                radius="sm" 
                className="mx-2"
            >
                <QueueListIcon className="h-[18px] w-[18px]"></QueueListIcon>Show All
            </Button>
            <Button
                color="default" variant="light"
                size="sm"
                radius="sm" 
                className="mx-2"
                onClick={downloadExcel}
            >
                <ArrowDownTrayIcon className="h-[18px] w-[18px]"></ArrowDownTrayIcon>Download
            </Button>
            <Button
                color="default" variant="light"
                size="sm"
                radius="sm" 
                className="mx-2"
            >
                <XMarkIcon className="h-[18px] w-[18px]"></XMarkIcon>Disband
            </Button>
            <Button
                color="default" variant="light"
                size="sm"
                radius="sm" 
                onClick={clearFilters}
                className="mx-2"
            >
                <FunnelIcon className="h-[18px] w-[18px]"></FunnelIcon>Clear Filters
            </Button>
            <div className="relative mr-2">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input 
                  type="text" 
                  id="table-search-users" 
                  className="w-[10rem] block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
            </div>
            <Dropdown
                showArrow
                classNames={{
                    base: "before:bg-default-200", // change arrow background
                    content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                }}
                >
                <DropdownTrigger>
                    <Button 
                        size="sm"
                        radius="sm" 
                        color="default" variant="light"
                    >
                    <EllipsisHorizontalCircleIcon className="h-[18px] w-[18px]"></EllipsisHorizontalCircleIcon>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
                <DropdownSection title="Actions">  
                    <DropdownItem
                        key=""
                        shortcut=""
                        description="Switch between cohorts"
                        startContent=""
                        onClick={handleOpenCohortModal}
                    >
                    <ArrowPathRoundedSquareIcon className="h-[18px] w-[18px]"></ArrowPathRoundedSquareIcon>Change Cohort
                    </DropdownItem>
                    <DropdownItem
                        key=""
                        shortcut=""
                        description="Change application status"
                        startContent=""
                    >
                    <ArrowPathRoundedSquareIcon className="h-[18px] w-[18px]"></ArrowPathRoundedSquareIcon>Change Status
                    </DropdownItem>
                    <DropdownItem
                        key=""
                        shortcut=""
                        description="Assign Mentors | Connectors"
                        startContent=""
                        onClick={handleOpenBoardModal}
                    >
                    <UserGroupIcon className="h-[18px] w-[18px]"></UserGroupIcon>Manage Advisory Board
                    </DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="Danger zone">  
                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        shortcut="⌘⇧D"
                        description="Permanently delete applicaitons"
                        startContent=""
                        onClick={handleOpenDeleteModal}
                    >
                    <TrashIcon className="h-[18px] w-[18px]"></TrashIcon>Delete Applications
                    </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
            {selectedRows !== 0 && (
                <div className="text-xs"><span className="font-black">Rows:</span> {selectedRows}</div>
            )}
            <DeleteSelectedModal
              isDeleteModalOpen={isDeleteModalOpen}
              setDeleteModalOpen={setDeleteModalOpen}
              deleteSelectedRows={deleteSelectedRows}
            />
            <ChangeCohortModal 
              isCohortModalOpen={isCohortModalOpen} 
              setCohortModalOpen={setCohortModalOpen} 
              changeCohorts={changeCohorts}
            />
            <ManageAdvisoryBoardModal 
              isBoardModalOpen={isBoardModalOpen}
              setBoardModalOpen={setBoardModalOpen}
              selectedRows={selectedRows}
              selectedRowsData={selectedRowsData}
            />
            <FeedbackModal 
              isOpen={isOpen} 
              onOpenChange={onOpenChange} 
              feedbackTitle={feedbackTitle}
              feedbackText={feedbackText}
            />
        </div>
    );
};
