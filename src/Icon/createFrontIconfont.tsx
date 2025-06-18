import React from "react";
import { Icon, type IconProps } from ".";

const loadedSet = new Set<string>();

export function createFrontIconfont(scriptUrl: string) {
  if (
    typeof scriptUrl === "string" &&
    scriptUrl.length &&
    !loadedSet.has(scriptUrl)
  ) {
    const script = document.createElement("script");
    script.setAttribute("src", scriptUrl);
    script.setAttribute("data-namespace", scriptUrl);
    document.body.appendChild(script);
    loadedSet.add(scriptUrl);
  }
  const Iconfont = React.forwardRef<SVGAElement, IconProps>((props, ref) => {
    const { type, ...rest } = props;
    return (
      <Icon {...rest} ref={ref}>
        {type ? <use xlinkHref={`#${type}`} /> : null}
      </Icon>
    );
  });
  return Iconfont;
}
