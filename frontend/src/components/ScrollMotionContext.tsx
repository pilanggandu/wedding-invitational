"use client";

import { createContext, useContext } from "react";

export const ScrollMotionContext = createContext(false);
export const useScrollMotion = () => useContext(ScrollMotionContext);
