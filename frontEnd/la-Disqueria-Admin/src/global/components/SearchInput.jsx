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
} from "@/global/components/input-group"

export function InputGroupInlineStart() {
  return (
    <Field className="max-w-sm mt-4">
      <InputGroup>
        <InputGroupInput id="inline-start-input" placeholder="Buscar" />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
