import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react"

interface FeedbackModalProps {
  isOpen: any;
  onOpenChange: any;
  feedbackTitle: string;
  feedbackText: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onOpenChange, feedbackTitle, feedbackText }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{feedbackTitle}</ModalHeader>
        <ModalBody>
          <p>
            {feedbackText}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onOpenChange}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default FeedbackModal;