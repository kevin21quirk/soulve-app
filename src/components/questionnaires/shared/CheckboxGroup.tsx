
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
}

const CheckboxGroup = ({ label, options, selectedValues, onChange, required = false }: CheckboxGroupProps) => {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, option]);
    } else {
      onChange(selectedValues.filter(item => item !== option));
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && "*"}</Label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
            />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
