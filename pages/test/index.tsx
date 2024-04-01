import { createInitialBudget } from "@/firebase/initial-budget";

export default function TestPage() {

    const handleOnClick = async () => {
        await createInitialBudget('00000000-0000-0000-0000-000000000000')
    }

    return (
        <button onClick={handleOnClick}>Click me</button>
    )
    
}