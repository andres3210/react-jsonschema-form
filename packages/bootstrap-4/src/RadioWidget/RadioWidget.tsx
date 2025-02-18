import React from "react";

import Form from "react-bootstrap/Form";

import { WidgetProps } from "@northek/rjsf-core";
import ExtendedHelp from "../ExtendedHelp";

const RadioWidget = ({
  id,
  schema,
  options,
  value,
  required,
  disabled,
  readonly,
  label,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  const { enumOptions, enumDisabled } = options;

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange(schema.type == "boolean" ? value !== "false" : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const inline = Boolean(options && options.inline);

  const Label = (<Form.Label>
      {label || schema.title}
      {(label || schema.title) && required ? "*" : null}
    </Form.Label>)

  return (
    <Form.Group className="mb-0">
      <div className="d-block">
        { typeof options["extended-help"] !== "undefined" ? 
          <ExtendedHelp help={options["extended-help"]}>{Label}</ExtendedHelp> : Label
        }
      </div>
      {(enumOptions as any).map((option: any, i: number) => {
        const itemDisabled =
          Array.isArray(enumDisabled) &&
          enumDisabled.indexOf(option.value) !== -1;
        const checked = option.value == value;

        const radio = (
          <Form.Check
            inline={inline}
            label={option.label}
            id={option.label}
            key={i}
            name={id}
            type="radio"
            disabled={disabled || itemDisabled || readonly}
            checked={checked}
            required={required}
            value={option.value}
            onChange={_onChange}
            onBlur={_onBlur}
            onFocus={_onFocus}
          />
        );
        return radio;
      })}
    </Form.Group>
  );
};

export default RadioWidget;
