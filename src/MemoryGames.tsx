import { CSSProperties, ReactNode, useEffect, useState } from "react";
import getGenerateGrid from "./getGenerateGrid";
import { availableCardStatuses } from "./consts";
import allEqual from "./allEqual";
import ReactFlipCard from "reactjs-flip-card";
import './MemoryGames.css'

interface MemoryGameProps {
  containerStyle?: CSSProperties;
  gridNumber: number;
  foundPair?: Function;
  notFoundPair?: Function;
  gameFinished?: Function;
  holeCardsColor?: string;
  foundCardsColor?: string;
  frontCardsCss?: string;
  backCardsCss?: string;
}

function validateGridNumber(gridNumber: number) {
  if (!Number.isInteger(gridNumber) || !(gridNumber >= 4 && gridNumber <= 6))
    throw new Error("grid number must be an Integer number between 4 and 6");
  return null;
}

export default function MemoryGames({
  containerStyle = {},
  gridNumber = 4,
  foundPair = () => undefined,
  notFoundPair = () => undefined,
  gameFinished = () => undefined,
  holeCardsColor = "orange",
  foundCardsColor = "yellow",
  frontCardsCss = "",
  backCardsCss = "",
}: MemoryGameProps) {
  useState(validateGridNumber(gridNumber));
  const [iconGrid] = useState<ReactNode[]>(getGenerateGrid(gridNumber));
  const [cardStatuses, setCardStatuses] = useState<string[]>(
    iconGrid.map((_) => availableCardStatuses.hole)
  );

  useEffect(() => {
    const finished = allEqual(cardStatuses, availableCardStatuses.discovered)
    if (finished) {
      setTimeout(() => {
        gameFinished()
      }, 200);
    }
  }, [cardStatuses]);

  useEffect(() => {
    let cardsClickedArray: { status: string, icon: ReactNode }[] = []
    cardStatuses.forEach((status, index) => {
      const icon = iconGrid[index]
      if (status === availableCardStatuses.clicked) {
        cardsClickedArray.push({ status, icon })
      }
    })
    if (cardsClickedArray.length === 2) {
      if (cardsClickedArray[0].icon === cardsClickedArray[1].icon) {
        foundPair()
        setTimeout(() => {
          const newCardStatuses = cardStatuses.map(status => {
            if (status === availableCardStatuses.clicked) 
              return availableCardStatuses.discovered
            return status
          })
          setCardStatuses(newCardStatuses)
        }, 200);
      } else {
        notFoundPair()
        setTimeout(() => {
          const newCardStatuses = cardStatuses.map(status => {
            if (status === availableCardStatuses.clicked) 
              return availableCardStatuses.hole
            return status
          })
          setCardStatuses(newCardStatuses)
        }, 700);
      }
    }
  }, [cardStatuses])

  const getCardStyle = (currentCardStatus: string) => ({
    background: currentCardStatus === availableCardStatuses.discovered
      ? foundCardsColor
      : holeCardsColor
  })

  const handleFlipClicked = (index: number) => {
    const cardStatusesClone = [...cardStatuses]
    const currentCard = cardStatusesClone[index]
    const twoCardClicked: boolean = cardStatusesClone.filter(
      c => c === availableCardStatuses.clicked
    ).length === 2

    if (twoCardClicked || currentCard === availableCardStatuses.clicked || currentCard === availableCardStatuses.discovered) {
     return 
    }
    cardStatusesClone[index] = availableCardStatuses.clicked
    setCardStatuses(cardStatusesClone)
  }

  return (
    <div>
      <div
        className={`MemoryGame_grid MemoryGame_gridTemplateColumns${gridNumber}`}
        style={containerStyle}
      >
        {iconGrid.map((icon, index) => {
          const currentCardStatus = cardStatuses[index]
          return <ReactFlipCard 
            key={index}
            flipCardContainerCss={`${currentCardStatus === availableCardStatuses.discovered ? 'MemoryGame_pairFound' : ''}`}
            flipByProp={currentCardStatus !== availableCardStatuses.hole}
            width={"auto"}
            height={"auto"}
            cursor={"pointer"}
            flipTrigger={"disabled"}
            frontStyle={getCardStyle(currentCardStatus)}
            backStyle={getCardStyle(currentCardStatus)}
            frontCss={`MemoryGame_cardCss ${frontCardsCss}`}
            backCss={`MemoryGame_cardCss ${backCardsCss}`}
            onClick={() => handleFlipClicked(index)}
            frontComponent={<div />}
            backComponent={<div className="MemoryGame_padding20">{icon}</div>}
          />
        })}
      </div>
    </div>
  );
}
