import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";

const TransitionWrapper = ({ children }) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-300"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scalee-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 sale-95"
    >
      {children}
    </Transition>
  );
};

export default TransitionWrapper;
