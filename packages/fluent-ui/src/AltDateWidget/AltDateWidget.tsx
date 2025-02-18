import React from "react";
import { WidgetProps } from "@northek/rjsf-core";

const AltDateWidget = (props: WidgetProps) => {
  const { registry } = props;
  const { TextWidget } = registry.widgets;
  return (
    <TextWidget {...props} />
  );
};

export default AltDateWidget;
