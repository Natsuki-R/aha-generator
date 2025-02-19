'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './style.module.css'

const dummyBlocks = ['Coffee', 'Work', 'Idea', 'Energy', 'Sleep', 'Focus']

export default function AhaPage() {
  const [blocks] = useState(dummyBlocks)
  const [panelBlocks, setPanelBlocks] = useState<string[]>([])
  const [mergedBlock, setMergedBlock] = useState<string | null>(null)

  const handleDrop = (text: string) => {
    if (panelBlocks.length < 2) {
      setPanelBlocks((prev) => [...prev, text])
    }

    // Simulate merging when 2 blocks are in the panel
    if (panelBlocks.length === 1) {
      setTimeout(() => {
        setMergedBlock(`${panelBlocks[0]} + ${text} = Aha!`)
        setPanelBlocks([])
      }, 500)
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Panel (Drop Zone) */}
      <motion.div className={styles.dropZone} animate={{ backgroundColor: panelBlocks.length ? '#ffeeba' : '#f8f9fa' }}>
        {mergedBlock ? (
          <motion.div className={styles.mergedBlock} initial={{ scale: 0 }} animate={{ scale: 1 }}>
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

      {/* Draggable Blocks */}
      <div className={styles.blocksContainer}>
        {blocks.map((text) => (
          <motion.div
            key={text}
            className={styles.block}
            drag
            dragConstraints={{ top: 0, left: 0, right: 300, bottom: 300 }}
            whileDrag={{ scale: 1.1 }}
            onDragEnd={() => handleDrop(text)}
          >
            {text}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
