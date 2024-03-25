import { EditItem } from "@/features/edit-categories";
import { Category } from "@/firebase/models";

export type EditPagePropsType = {
	categories: Category[];
};

export function EditPage(props: EditPagePropsType) {
	const { categories } = props;

	const editItems: JSX.Element[] = [];

	for (let i = 1; i < categories.length; i++) {
		const category = categories[i];
		console.log("on category", category);
		editItems.push(<EditItem category={category} subcategory={null} />);

		for (let i = 0; i < category.subcategories.length; i++) {
			const subcategory = category.subcategories[i];
			console.log("on subcategory", subcategory);
			editItems.push(<EditItem category={null} subcategory={subcategory} />);
		}
	}

	return <>{editItems}</>;
}
