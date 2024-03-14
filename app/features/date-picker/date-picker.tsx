import styles from "./date-picker.module.scss";
import { IconButton } from "../ui";

export type DatePickerPropsType = {
    monthAcronyms: string[];
	handlePreviousYearOnClick: () => void;
	handleNextYearOnClick: () => void;
	handleMonthOnClick: (index: number) => void;
};

export function DatePicker(props: DatePickerPropsType) {
	const { monthAcronyms, handlePreviousYearOnClick, handleNextYearOnClick, handleMonthOnClick } = props;

	let trArray: JSX.Element[] = [];
	let tdArray: JSX.Element[] = [];
	monthAcronyms.map((acronym, index) => {
		tdArray.push(
			<td
				key={index}
				onClick={() => {
					handleMonthOnClick(index);
				}}
			>
				{acronym}
			</td>
		);
		if (index === 3 || index === 7 || index === 11) {
			trArray.push(<tr>{tdArray}</tr>);
			tdArray = [];
		}
	});

	return (
		<section className={styles.datePicker}>
			<header>
				<IconButton button={{ onClick: handlePreviousYearOnClick }} src="/icons/arrow-left.svg" altText="Button to select previous year" />
				<h1>2024</h1>
				<IconButton button={{ onClick: handleNextYearOnClick }} src="/icons/arrow-right.svg" altText="Button to select next year" />
			</header>
			<table>
				<tbody>{trArray}</tbody>
			</table>
		</section>
	);
}
