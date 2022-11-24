import React from "react";
import Form from "react-bootstrap/Form";
import { WidgetProps } from "@northek/rjsf-core";
import ExtendedHelp from "../ExtendedHelp";

const selectValue = (value: any, selected: any, all: any) => {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));

  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
};

const deselectValue = (value: any, selected: any) => {
  return selected.filter((v: any) => v !== value);
};

const CheckboxesWidget = ({
  schema,
  label,
  id,
  disabled,
  options,
  value,
  autofocus,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  const { enumOptions, enumDisabled, inline } = options;

  const _onChange = (option: any) => ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const all = (enumOptions as any).map(({ value }: any) => value);

    if (checked) {
      onChange(selectValue(option.value, value, all));
    } else {
      onChange(deselectValue(option.value, value));
    }
  };

  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const Label = (<Form.Label htmlFor={id}>{label || schema.title}</Form.Label>)
  return (
    <>
      { typeof options["extended-help"] !== "undefined" ? 
        <ExtendedHelp help={options["extended-help"]}>{Label}</ExtendedHelp> : 
        Label
      }
      <Form.Group>
        {(enumOptions as any).map((option: any, index: number) => {
          const checked = value.indexOf(option.value) !== -1;
          const itemDisabled =
            enumDisabled && (enumDisabled as any).indexOf(option.value) != -1;

          return inline ? (
              <Form.Check
                key={index}
                required={required}
                inline
                className="bg-transparent border-0"
                custom
                checked={checked}
                type={"checkbox"}
                id={`${id}_${index}`}
                label={option.label}
                autoFocus={autofocus && index === 0}
                onChange={_onChange(option)}
                onBlur={_onBlur}
                onFocus={_onFocus}
                disabled={disabled || itemDisabled || readonly}
              />
          ) : (
              <Form.Check
                key={index}
                custom
                required={required}
                checked={checked}
                className="bg-transparent border-0"
                type={"checkbox"}
                id={`${id}_${index}`}
                label={option.label}
                autoFocus={autofocus && index === 0}
                onChange={_onChange(option)}
                onBlur={_onBlur}
                onFocus={_onFocus}
                disabled={disabled || itemDisabled || readonly}
              />
          );
        })}
      </Form.Group>
    </>
  );
};

export default CheckboxesWidget;
