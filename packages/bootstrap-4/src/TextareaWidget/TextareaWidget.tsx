import React from "react";

import { WidgetProps } from "@northek/rjsf-core";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ExtendedHelp from "../ExtendedHelp";

type CustomWidgetProps = WidgetProps & {
  options: any;
};

const TextareaWidget = ({
  id,
  placeholder,
  value,
  required,
  disabled,
  autofocus,
  label,
  readonly,
  onBlur,
  onFocus,
  onChange,
  options,
  schema,
  rawErrors = [],
}: CustomWidgetProps) => {
  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) =>
    onChange(value === "" ? options.emptyValue : value);
  const _onBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLTextAreaElement>) => onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLTextAreaElement>) => onFocus(id, value);

  const Label = (<label htmlFor={id}>
      {label || schema.title}
      {required && (
        <span
          aria-hidden
          className={rawErrors.length > 0 ? "text-danger ml-1" : "ml-1"}>
          &thinsp;{"*"}
        </span>
      )}
    </label>)
  return (
    <>
      { typeof options["extended-help"] !== "undefined" ? 
        <ExtendedHelp help={options["extended-help"]}>{Label}</ExtendedHelp> : 
        Label
      }
      <InputGroup>
        <FormControl
          id={id}
          as="textarea"
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
          value={value}
          required={required}
          autoFocus={autofocus}
          rows={options.rows || 5}
          onChange={_onChange}
          onBlur={_onBlur}
          onFocus={_onFocus}
        />
      </InputGroup>
    </>
  );
};

export default TextareaWidget;
