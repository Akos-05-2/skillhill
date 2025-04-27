import { useState } from "react";

export default function Checkbox() {
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = () => {
        setChecked(!checked);
    };
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label className="ml-2">Checkbox Label</label>
        </div>
    );
}
