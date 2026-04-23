import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/global/components/InputGroup"

export function MoneyInput({ value, onChange, disabled }) {
  return (
    <div className="w-full">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>

        <InputGroupInput
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, "")
            onChange(val)
          }}
          placeholder="0.00"
        />
      </InputGroup>
    </div>
  )
}