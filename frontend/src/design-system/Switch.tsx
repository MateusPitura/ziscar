import { Switch as SwitchShadcn } from "@/components/ui/switch";
import { type ReactNode } from "react";
import InputLabel from "./Form/InputLabel";

interface SwitchProperties {
  label: string;
  onCheck: () => void;
  onUncheck: () => void;
  checked: boolean;
}

export default function Switch({
  label,
  onCheck,
  onUncheck,
  checked,
}: SwitchProperties): ReactNode {
  return (
    <>
      <div className="flex items-center gap-2">
        <SwitchShadcn
          checked={checked}
          onCheckedChange={(state) => {
            if (state) {
              onCheck();
              return;
            }
            onUncheck();
          }}
          className="data-[state=checked]:bg-blue-800 data-[state=unchecked]:bg-neutral-300"
        />
        <InputLabel label={label} />
      </div>
    </>
  );
}
