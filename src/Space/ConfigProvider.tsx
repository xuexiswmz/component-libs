import React, { type PropsWithChildren } from "react";
import type { SizeType } from ".";

export interface ConfigContextType {
  space?: {
    size?: SizeType;
  };
}
export const ConfigContext = React.createContext<ConfigContextType>({});

interface ConfigProviderProps extends PropsWithChildren<ConfigContextType> {}

export function ConfigProvider(props: ConfigProviderProps) {
  const { space, children } = props;

  return (
    <ConfigContext.Provider value={{ space }}>
      {children}
    </ConfigContext.Provider>
  );
}
