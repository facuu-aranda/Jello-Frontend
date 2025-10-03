"use client"

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const colors = [
  'bg-slate-500', 'bg-gray-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500',
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500'
];

interface ColorSelectorProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export function ColorSelector({ selectedColor, onSelectColor }: ColorSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "w-8 h-8 rounded-full border-2 border-transparent transition-all",
            color,
            selectedColor === color ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : ''
          )}
          onClick={() => onSelectColor(color)}
          aria-label={`Select color ${color}`}
        >
          {selectedColor === color && <Check className="w-5 h-5 text-white" />}
        </button>
      ))}
    </div>
  );
}