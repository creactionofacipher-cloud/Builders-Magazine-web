import { useMemo } from "react";
import { Select } from "@sanity/ui";
import { set, unset, useFormValue, type StringInputProps } from "sanity";

interface NominationOption {
  _key: string;
  title?: string;
}

// Lets an editor pick a winner's nomination from this exact Builders Cup
// document's own `nominations` array (read live via useFormValue, not a
// separate fetch) — structurally impossible to select a nomination that
// belongs to a different event, since the list only ever contains this
// document's own entries. Stores the nomination's `_key`, not a Sanity
// `reference`: array-item objects aren't documents, so the native
// reference type can't target them.
export function NominationSelectInput(props: StringInputProps) {
  const { value, onChange, readOnly, elementProps } = props;
  const nominations = (useFormValue(["nominations"]) as NominationOption[] | undefined) ?? [];

  const options = useMemo(
    () =>
      nominations
        .filter((nomination): nomination is NominationOption => Boolean(nomination?._key))
        .map((nomination) => ({
          key: nomination._key,
          title: nomination.title || "Untitled nomination",
        })),
    [nominations],
  );

  return (
    <Select
      {...elementProps}
      value={value ?? ""}
      readOnly={readOnly}
      onChange={(event) => {
        const next = event.currentTarget.value;
        onChange(next ? set(next) : unset());
      }}
    >
      <option value="">— Select nomination —</option>
      {options.map((option) => (
        <option key={option.key} value={option.key}>
          {option.title}
        </option>
      ))}
    </Select>
  );
}
