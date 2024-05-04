import { ChangeEvent } from "react";
import styles from "./test.module.scss";

export type TestPropsType = {};

export function Test(props: TestPropsType) {

    const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        
    }

	return (
		<>
			<input type="text" onChange={handleInputOnChange}/>
		</>
	);
}
