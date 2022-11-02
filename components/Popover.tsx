import React, { cloneElement, useMemo, useState } from "react";
import { useRouter } from 'next/router'
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useClick,
  FloatingFocusManager
} from "@floating-ui/react-dom-interactions";
import { mergeRefs } from "react-merge-refs";
import { tagifyDate } from "./DayPicker";

interface Props {
  render: (data: {
    close: (from?: Date | undefined, to?: Date | undefined) => void;
  }) => React.ReactNode;
  placement?: Placement;
  children: JSX.Element;
}

export const Popover = ({ children, render, placement }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift()],
    placement,
    whileElementsMounted: autoUpdate
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context)
  ]);

  // Preserve the consumer's ref
  const ref = useMemo(() => mergeRefs([reference, (children as any).ref]), [
    reference,
    children
  ]);

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref, ...children.props }))}
      {open && (
        <FloatingFocusManager
          context={context}
          order={["reference", "content"]}
          returnFocus={false}
        >
          <div
            ref={floating}
            className="Popover"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0
            }}
            {...getFloatingProps()}
          >
            {render({
              close: (from, to) => {
                setOpen(false);
                if (from) {
                  const newQueryParams = {
                    ...router.query,
                    ...(from && { from: tagifyDate(from) }),
                    ...(to && { to: tagifyDate(to) })
                  }
                  router.replace({
                    pathname: router.pathname,
                    query: newQueryParams,
                  })
                }
              }
            })}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};
