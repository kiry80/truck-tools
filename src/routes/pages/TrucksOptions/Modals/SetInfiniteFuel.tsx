import { useState } from "react";
import { useProfileContex } from "../../../../hooks/useProfileContex";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import AlertSave from "../../../../components/AlertSave";

// icons
import { IconPencil } from "@tabler/icons-react";

interface completedProps {
    error: boolean;
    completed: boolean;
}

const SetInfiniteFuel = () => {
    const { selectedSave } = useProfileContex();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [completed, setCompleted] = useState<completedProps>({
        error: false,
        completed: false,
    });

    const onClickApply = async () => {
        if (completed.completed) {
            setCompleted({ error: false, completed: false });
        }

        if (selectedSave) {
            setIsLoading(true);
            /*
            funtion to repair truck
            */
        }
        setIsLoading(false);
    };

    return (
        <>
            <Button
                endContent={<IconPencil stroke={2} />}
                onPress={onOpen}
                isDisabled={!selectedSave}
                color="primary"
                variant="shadow"
            >
                Open
            </Button>
            <Modal
                hideCloseButton
                size="sm"
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Infinite fuel on current truck
                            </ModalHeader>
                            <ModalBody className="py-1">
                                <p>
                                    Exactly the fuel is not infinite but it is
                                    for approximately 5.000.000 KM (depending on
                                    the truck).
                                </p>
                                <div className="flex justify-center">
                                    <AlertSave
                                        message={
                                            completed.error
                                                ? "An error occurred in the process"
                                                : "Saved successfully"
                                        }
                                        error={completed.error}
                                        show={completed.completed}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    color="success"
                                    onPress={onClickApply}
                                >
                                    Refuel
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default SetInfiniteFuel;
