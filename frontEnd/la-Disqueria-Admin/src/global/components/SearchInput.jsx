import { SearchIcon } from "lucide-react"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/global/components/Field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/global/components/InputGroup"

export function InputGroupInlineStart({ value, onChange, placeholder = "Buscar" }) {
  return (
    <Field className="max-w-sm mt-4">
      <InputGroup className=" bg-[#F5F6F1]">
        <InputGroupInput
          id="inline-start-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
