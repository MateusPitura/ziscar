import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import type { ReactElement } from "react";

interface EmailFormProperties {}

export default function EmailForm({}: EmailFormProperties): ReactElement {
  function handleSubmit(value) {
    console.log("🌠 value: ", value);
  }

  return (
    <Form onSubmit={handleSubmit} defaultValues={{ email: "mateus@email.com" }}>
      <div className="flex flex-col gap-2 ">
        <Input name="email" label="Email" />
        <input type="submit" />
      </div>
    </Form>
  );
}
