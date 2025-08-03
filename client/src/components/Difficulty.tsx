import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DifficultyProps {
  value: string | null;
  onChange: (value: string) => void;
}

export default function Difficulty({ value, onChange }: DifficultyProps) {
  return (
    <div className="py-5">
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={value || "Select Difficulty"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>
      <p className="m-2 text-sm text-muted-foreground">
        Selected: {value || "None"}
      </p>
    </div>
  );
}
