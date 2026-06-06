import { Flex as RFlex, type FlexProps } from "@radix-ui/themes";

export const Flex = ({ children, ...props }: FlexProps) => {
  return (
    <RFlex align="center" gap="1" {...props}>
      {children}
    </RFlex>
  );
};
