import classNames from "classnames";
import styles from "./icon-button.module.scss";

export type IconButtonPropsType = {
	src: string;
	altText: string;
};

export function IconButton(props: IconButtonPropsType) {
	const { src, altText } = props;

	return (
		<button className={styles.iconButton}>
			{/*eslint-disable-next-line @next/next/no-img-element*/}
			<img src={src} alt={altText} />
		</button>
	);
}
