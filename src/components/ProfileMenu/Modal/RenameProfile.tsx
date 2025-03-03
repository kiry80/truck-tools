import { useState, useContext, useEffect, FC } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	Input,
} from "@heroui/react";
import { setNewProfileName } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconDeviceFloppy } from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

interface ModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const RenameProfile: FC<ModalProps> = ({ isOpen, onOpenChange }) => {
	const { selectedProfile, reloadProfiles } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { btn_rename_profile } =
		translations.components.player_profile.dropdown.profile_options;

	const [ProfileName, setProfileName] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (ProfileName.length === 0 || ProfileName.length > 20) return;
		if (!selectedProfile) return;

		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		setIsLoading(true);

		const res = await setNewProfileName(selectedProfile.dir, ProfileName);

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
		reloadProfiles();
	};

	useEffect(() => {
		if (selectedProfile) {
			setProfileName(selectedProfile.name);
		}
	}, [selectedProfile]);

	return (
		<Modal
			hideCloseButton
			size="md"
			backdrop="blur"
			isOpen={isOpen}
			onOpenChange={() => {
				if (isLoading) return;
				onOpenChange();
			}}
			shouldBlockScroll={false}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{btn_rename_profile.modal.title}
						</ModalHeader>
						<Divider />
						<ModalBody className="py-1">
							<p>{btn_rename_profile.modal.description}</p>
							<Input
								className="mt-1"
								isInvalid={ProfileName.length === 0 || ProfileName.length > 20}
								startContent={<IconPencil />}
								label={btn_rename_profile.modal.input_new_name.label}
								placeholder={
									btn_rename_profile.modal.input_new_name.placeholder
								}
								value={ProfileName}
								isDisabled={selectedProfile ? false : true}
								onValueChange={(value) => setProfileName(value)}
								variant="bordered"
							/>
							<AlertSave
								message={
									completed.error
										? translations.components.alert_on_save_default.error
										: translations.components.alert_on_save_default.succes
								}
								error={completed.error}
								show={completed.completed}
								setShowFalse={() =>
									setCompleted({ error: completed.error, completed: false })
								}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								{btn_rename_profile.modal.btn_close}
							</Button>
							<Button
								endContent={<IconDeviceFloppy />}
								isLoading={isLoading}
								color="success"
								onPress={onClickApply}
								isDisabled={selectedProfile ? false : true}
							>
								{btn_rename_profile.modal.btn_apply}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default RenameProfile;
