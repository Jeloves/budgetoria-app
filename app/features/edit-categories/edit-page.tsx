import { EditItem } from "@/features/edit-categories";
import { Category } from "@/firebase/models";
import { NIL as NIL_UUID } from "uuid";

export type EditPagePropsType = {
	categories: Category[];
};

export function EditPage(props: EditPagePropsType) {
	const { categories } = props;

	const editItems: JSX.Element[] = [];
	let keyIndex = 0;
	for (const category of categories) {
		if (category.id === NIL_UUID) {
			continue;
		}
		editItems.push(<EditItem key={keyIndex} category={category} subcategory={null} />);
		keyIndex++;
		for (const subcategory of category.subcategories) {
			editItems.push(<EditItem key={keyIndex} category={null} subcategory={subcategory} />);
			keyIndex++;
		}
	}

	return <>{editItems}</>;
}
