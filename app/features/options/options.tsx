import { deleteCurrentUser, getUser, signOutUser } from "@/firebase/auth";
import styles from "./options.module.scss";
import { useRouter } from "next/navigation";

export type OptionsPropsType = {
	handleHideOptions: () => void;
};

export function Options(props: OptionsPropsType) {
	const { handleHideOptions } = props;

    const router = useRouter();

	const handleChangeBudget = () => {};
	const handleSignOut = () => {
		signOutUser().then(
			() => {
				console.log("sign out successful");
                router.push("/");
			},
			(error) => {
				console.error("Failed to sign out", error);
				console.log(getUser());
			}
		);
	};
	const handleDeleteUser = () => {
        deleteCurrentUser().then(
			() => {
				alert("User account successfully deleted.")
                router.push("/");
			},
			(error) => {
				console.error("Failed to delete user", error);
			}
		);
    };

	return (
		<div className={styles.optionsContainer}>
			<button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img onClick={handleHideOptions} src="/icons/circled-x-grey-100.svg" alt="Button to hide options"/>
            </button>
			<button onClick={handleChangeBudget}>Change Budget</button>
			<button onClick={handleSignOut}>Sign Out</button>
			<button onClick={handleDeleteUser}>Delete User Account</button>
		</div>
	);
}
