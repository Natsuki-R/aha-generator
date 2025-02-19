"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./style.module.css";
import { generate } from "random-words";

export default function AhaPage() {
  const [blocks, setBlocks] = useState<string[]>([]);
  const [panelBlocks, setPanelBlocks] = useState<string[]>([]);
  const [mergedBlock, setMergedBlock] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // Generate random words on the client only
  useEffect(() => {
    const uniqueWords = new Set<string>();

    while (uniqueWords.size < 20) {
      const newWords = generate({ exactly: 20 });

      // Ensure newWords is an array before using forEach
      (Array.isArray(newWords) ? newWords : [newWords]).forEach((word) => {
        uniqueWords.add(word);
      });
    }

    setBlocks(Array.from(uniqueWords));
  }, []);

  const handleDrop = (text: string) => {
    setPanelBlocks((prev) => {
      if (prev.includes(text)) return prev;

      const newBlocks = [...prev, text];

      // Remove used words from available blocks
      setBlocks((prevBlocks) =>
        prevBlocks.filter((b) => !newBlocks.includes(b))
      );

      if (newBlocks.length === 2) {
        setTimeout(() => {
          const newIdea = generate();
          setMergedBlock(`${newBlocks[0]} + ${newBlocks[1]} = ${newIdea}`);
          setPanelBlocks([]);
        }, 300);
      }

      return newBlocks.length < 2 ? newBlocks : [];
    });
  };

  const handleDragEnd = (
    info: { point: { x: number; y: number } },
    text: string
  ) => {
    if (dropZoneRef.current) {
      const dropZoneRect = dropZoneRef.current.getBoundingClientRect();
      const { x, y } = info.point;

      if (
        x >= dropZoneRect.left &&
        x <= dropZoneRect.right &&
        y >= dropZoneRect.top &&
        y <= dropZoneRect.bottom
      ) {
        handleDrop(text);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Draggable Blocks */}
      <div className={styles.blocksContainer}>
        {blocks.map((text) => (
          <motion.div
            key={text}
            className={styles.block}
            drag
            dragConstraints={{ top: 0, left: 0, right: 300, bottom: 300 }}
            whileDrag={{ scale: 1.1 }}
            onDragEnd={(event, info) => handleDragEnd(info, text)}
          >
            {text}
          </motion.div>
        ))}
      </div>

      {/* Drop Zone */}
      <motion.div
        ref={dropZoneRef}
        className={styles.dropZone}
        animate={{
          backgroundColor: panelBlocks.length ? "#ffeeba" : "#f8f9fa",
        }}
      >
        {mergedBlock ? (
          <motion.div
            className={styles.mergedBlock}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {mergedBlock}
          </motion.div>
        ) : panelBlocks.length > 0 ? (
          panelBlocks.map((text, index) => (
            <motion.div key={index} className={styles.block} layout>
              {text}
            </motion.div>
          ))
        ) : (
          <span>Drop blocks here</span>
        )}
      </motion.div>

      {/* Reset Button */}
      {mergedBlock && (
        <button
          className={styles.resetButton}
          onClick={() => {
            setMergedBlock(null);
            const newWords = generate({ exactly: 20 });
            setBlocks(Array.isArray(newWords) ? newWords : [newWords]); // Ensure it's always an array
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}
