import { ReactNode } from "react";
import { utf8Icons } from "./consts";
import shuffleArray from "./shuffleArray";

export default function getGenerateGrid(number: number): ReactNode[] {
  let icons = [...utf8Icons]
  icons = shuffleArray(icons)
  let slicedArray = icons.slice(0, number * 2)
  slicedArray = slicedArray.flatMap(i => [i, i])
  slicedArray = shuffleArray(slicedArray)
  return slicedArray
}