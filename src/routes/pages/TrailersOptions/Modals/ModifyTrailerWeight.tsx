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
    Input,
} from "@nextui-org/react";
import { setChassisMassTrailer } from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import { IconPencil } from "@tabler/icons-react";

interface completedProps {
    error: boolean;
    completed: boolean;
}

interface ModifyTrailerWeightProps {
    chassisMass: string;
    bodyMass: string;
}

const ModifyTrailerWeight = () => {
    const { selectedSave } = useProfileContex();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [TrailerWeight, setTrailerWeight] =
        useState<ModifyTrailerWeightProps>({
            chassisMass: "",
            bodyMass: "",
        });
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
            const res = await setChassisMassTrailer(
                selectedSave.dir,
                TrailerWeight.chassisMass,
                TrailerWeight.bodyMass
            );
            setCompleted({
                error: !res,
                completed: true,
            });
        }
        setIsLoading(false);
    };

    return (
        <>
            <Button
                endContent={<IconPencil stroke={2} />}
                onPress={onOpen}
                color="primary"
                variant="shadow"
            >
                Open
            </Button>
            <Modal
                hideCloseButton
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Change trailer weight
                            </ModalHeader>
                            <ModalBody className="items-center">
                                <Input
                                    label="Chassis Mass"
                                    placeholder="Enter weight in kg"
                                    value={TrailerWeight.chassisMass}
                                    onValueChange={(value) =>
                                        setTrailerWeight({
                                            ...TrailerWeight,
                                            chassisMass: value,
                                        })
                                    }
                                />
                                <Input
                                    label="Body Mass"
                                    placeholder="Enter weight in kg"
                                    value={TrailerWeight.bodyMass}
                                    onValueChange={(value) =>
                                        setTrailerWeight({
                                            ...TrailerWeight,
                                            bodyMass: value,
                                        })
                                    }
                                />
                                <AlertSave
                                    message={
                                        completed.error
                                            ? "An error occurred in the process"
                                            : "Saved successfully"
                                    }
                                    error={completed.error}
                                    show={completed.completed}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    isDisabled={isLoading}
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
                                    Apply
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModifyTrailerWeight;
