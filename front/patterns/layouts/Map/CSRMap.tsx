"use client";

import dynamic from "next/dynamic";
const CSRMap = dynamic(() => import("./Map"), { ssr: false });
export default CSRMap;
