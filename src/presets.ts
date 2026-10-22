import type { Scene } from './types';
import { v4 as uuidv4 } from 'uuid';

export const presets: Record<string, Scene> = {
  "Fox Style Lower Third": {
    width: 1920,
    height: 1080,
    backgroundColor: '#000000',
    elements: [
      {
        id: uuidv4(),
        type: 'rect',
        name: 'Red Bar',
        x: 100, y: 800, width: 1500, height: 80,
        rotation: 0, opacity: 1, locked: true, hidden: false,
        fill: '#cc0000', stroke: '#ffffff', strokeWidth: 2,
        shadowColor: '#000000', shadowBlur: 10, shadowOpacity: 0.5, shadowOffsetX: 5, shadowOffsetY: 5
      },
      {
        id: uuidv4(),
        type: 'text',
        name: 'Headline',
        x: 120, y: 810, width: 1460, height: 60,
        rotation: 0, opacity: 1, locked: false, hidden: false,
        text: 'BREAKING NEWS: MAJOR DEVELOPMENTS EXPECTED SHORTLY',
        fontSize: 48, fontFamily: 'Arial', fontStyle: 'bold', align: 'left',
        fill: '#ffffff', lineHeight: 1, letterSpacing: 0,
        shadowColor: '#000000', shadowBlur: 5, shadowOpacity: 0.8, shadowOffsetX: 2, shadowOffsetY: 2
      },
      {
        id: uuidv4(),
        type: 'rect',
        name: 'Blue Bar',
        x: 100, y: 880, width: 1720, height: 60,
        rotation: 0, opacity: 1, locked: true, hidden: false,
        fill: '#0033a0', stroke: '#ffffff', strokeWidth: 2,
        shadowColor: '#000000', shadowBlur: 10, shadowOpacity: 0.5, shadowOffsetX: 5, shadowOffsetY: 5
      },
      {
        id: uuidv4(),
        type: 'text',
        name: 'Ticker',
        x: 120, y: 895, width: 1680, height: 40,
        rotation: 0, opacity: 1, locked: false, hidden: false,
        text: 'MARKETS RALLY AS TECH STOCKS SURGE • PRESIDENT ADDRESSES NATION AT 8 PM • WEATHER WARNING IN EFFECT',
        fontSize: 24, fontFamily: 'Arial', fontStyle: 'normal', align: 'left',
        fill: '#ffffff', lineHeight: 1, letterSpacing: 2
      },
      {
        id: uuidv4(),
        type: 'rect',
        name: 'Live Bug Background',
        x: 1500, y: 100, width: 180, height: 60,
        rotation: 0, opacity: 1, locked: true, hidden: false,
        fill: '#cc0000', stroke: '#ffffff', strokeWidth: 2
      },
      {
        id: uuidv4(),
        type: 'text',
        name: 'Live Bug Text',
        x: 1510, y: 115, width: 160, height: 40,
        rotation: 0, opacity: 1, locked: false, hidden: false,
        text: 'LIVE',
        fontSize: 32, fontFamily: 'Arial', fontStyle: 'bold', align: 'center',
        fill: '#ffffff', lineHeight: 1, letterSpacing: 2
      }
    ]
  },
  "Modern Minimalist": {
    width: 1920,
    height: 1080,
    backgroundColor: '#111111',
    elements: [
      {
        id: uuidv4(),
        type: 'rect',
        name: 'Dark Card',
        x: 150, y: 750, width: 1000, height: 200,
        rotation: 0, opacity: 0.85, locked: true, hidden: false,
        fill: '#222222', stroke: '#444444', strokeWidth: 1,
        shadowColor: '#000000', shadowBlur: 30, shadowOpacity: 0.5, shadowOffsetX: 0, shadowOffsetY: 10
      },
      {
        id: uuidv4(),
        type: 'text',
        name: 'Category',
        x: 200, y: 780, width: 900, height: 30,
        rotation: 0, opacity: 1, locked: false, hidden: false,
        text: 'TECHNOLOGY',
        fontSize: 20, fontFamily: 'Inter', fontStyle: 'bold', align: 'left',
        fill: '#00aaff', lineHeight: 1, letterSpacing: 4
      },
      {
        id: uuidv4(),
        type: 'text',
        name: 'Headline',
        x: 200, y: 820, width: 900, height: 100,
        rotation: 0, opacity: 1, locked: false, hidden: false,
        text: 'New AI Models Promise Breakthroughs in Medical Research',
        fontSize: 42, fontFamily: 'Inter', fontStyle: 'bold', align: 'left',
        fill: '#ffffff', lineHeight: 1.2, letterSpacing: -1
      }
    ]
  }
};
