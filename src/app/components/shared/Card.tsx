"use client";

import { CARD_CLASS, CARD_CLASS_FLEX, CARD_TITLE_CLASS } from "./styles";

type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  flex?: boolean;
};

export default function Card({ title, children, className = "", flex }: CardProps) {
  const baseClass = flex ? CARD_CLASS_FLEX : CARD_CLASS;
  return (
    <div className={`${baseClass} ${className}`.trim()}>
      <div className={CARD_TITLE_CLASS}>{title}</div>
      {children}
    </div>
  );
}
