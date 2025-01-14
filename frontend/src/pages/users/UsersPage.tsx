import Button from "@/design-system/Button";

export default function UsersPage() {
  return (
    <>
      Variants
      <div className="flex gap-2 p-2">
        <Button
          variant="primary"
          label="Button"
          onClick={() => {
            alert("teste");
          }}
        />
        <Button variant="secondary" label="Button" onClick={() => {}} />
        <Button variant="tertiary" label="Button" onClick={() => {}} />
        <Button variant="quaternary" label="Button" onClick={() => {}} />
        <div className="bg-blue-100 p-2 gap-2 flex">
          <Button variant="primary" label="Button" onClick={() => {}} />
          <Button variant="secondary" label="Button" onClick={() => {}} />
          <Button variant="tertiary" label="Button" onClick={() => {}} />
          <Button variant="quaternary" label="Button" onClick={() => {}} />
        </div>
      </div>
      Active
      <div className="flex gap-2 p-2">
        <Button
          variant="primary"
          state="active"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="secondary"
          state="active"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="tertiary"
          state="active"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="quaternary"
          state="active"
          label="Button"
          onClick={() => {}}
        />
        <div className="bg-blue-100 p-2 gap-2 flex">
          <Button
            variant="primary"
            state="active"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="secondary"
            state="active"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="tertiary"
            state="active"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="quaternary"
            state="active"
            label="Button"
            onClick={() => {}}
          />
        </div>
      </div>
      Disabled
      <div className="flex gap-2 p-2">
        <Button
          variant="primary"
          state="disabled"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="secondary"
          state="disabled"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="tertiary"
          state="disabled"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="quaternary"
          state="disabled"
          label="Button"
          onClick={() => {}}
        />
        <div className="bg-blue-100 p-2 gap-2 flex">
          <Button
            variant="primary"
            state="disabled"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="secondary"
            state="disabled"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="tertiary"
            state="disabled"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="quaternary"
            state="disabled"
            label="Button"
            onClick={() => {}}
          />
        </div>
      </div>
      Error
      <div className="flex gap-2 p-2">
        <Button
          variant="primary"
          state="red"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="secondary"
          state="red"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="tertiary"
          state="red"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="quaternary"
          state="red"
          label="Button"
          onClick={() => {}}
        />
        <div className="bg-blue-100 p-2 gap-2 flex">
          <Button
            variant="primary"
            state="red"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="secondary"
            state="red"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="tertiary"
            state="red"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="quaternary"
            state="red"
            label="Button"
            onClick={() => {}}
          />
        </div>
      </div>
      Loading
      <div className="flex gap-2 p-2">
        <Button
          variant="primary"
          state="loading"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="secondary"
          state="loading"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="tertiary"
          state="loading"
          label="Button"
          onClick={() => {}}
        />
        <Button
          variant="quaternary"
          state="loading"
          label="Button"
          onClick={() => {}}
        />
        <div className="bg-blue-100 p-2 gap-2 flex">
          <Button
            variant="primary"
            state="loading"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="secondary"
            state="loading"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="tertiary"
            state="loading"
            label="Button"
            onClick={() => {}}
          />
          <Button
            variant="quaternary"
            state="loading"
            label="Button"
            onClick={() => {}}
          />
        </div>
      </div>
      Full
      <div className="flex gap-2 p-2">
        <div className="bg-green-200 w-40">
          <Button
            fullWidth
            variant="primary"
            label="Button"
            onClick={() => {}}
            textAlign="start"
          />
        </div>
        <div className="bg-green-200 w-40">
          <Button
            fullWidth
            variant="secondary"
            label="Button"
            onClick={() => {}}
            textAlign="center"
          />
        </div>
        <div className="bg-green-200 w-40">
          <Button
            fullWidth
            variant="tertiary"
            label="Button"
            onClick={() => {}}
            textAlign="end"
            />
        </div>
        <div className="bg-green-200 w-40">
          <Button
            fullWidth
            variant="quaternary"
            label="Button"
            onClick={() => {}}
          />
        </div>
      </div>
    </>
  );
}
