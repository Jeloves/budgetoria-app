import styles from "./icon-button.module.scss";
import { ButtonHTMLAttributes } from "react";
import "../../../reset.css"

export type IconButtonPropsType = {
	button: ButtonHTMLAttributes<HTMLButtonElement> & {
		onClick: () => void;
	};
	src: string;
	altText: string;
};

export function IconButton(props: IconButtonPropsType) {
	const { button, src, altText } = props;

	return (
		<button {...button} className={styles.iconButton}>
			{/*eslint-disable-next-line @next/next/no-img-element*/}
			<img src={src} alt={altText} />
		</button>
	);
}
